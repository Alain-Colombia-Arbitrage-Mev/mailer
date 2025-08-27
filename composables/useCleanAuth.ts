/**
 * Sistema de autenticación limpio y directo
 * Prioriza Supabase pero mantiene compatibilidad con el sistema legacy
 */

export const useCleanAuth = () => {
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  const supabaseSession = useSupabaseSession()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Estado de autenticación unificado
   */
  const isAuthenticated = computed(() => {
    // Verificar Supabase primero
    if (supabaseUser.value) {
      return true
    }

    // Verificar localStorage como fallback
    if (process.client) {
      const sessionStr = localStorage.getItem('admin_session')
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          const now = Date.now()
          const sessionAge = now - (session.timestamp || 0)
          const maxAge = 24 * 60 * 60 * 1000 // 24 horas
          
          return sessionAge <= maxAge && session.isAuthenticated && session.user?.isAdmin
        } catch {
          return false
        }
      }
    }

    return false
  })

  /**
   * Usuario actual unificado
   */
  const currentUser = computed(() => {
    // Priorizar datos de Supabase
    if (supabaseUser.value) {
      return {
        id: supabaseUser.value.id,
        email: supabaseUser.value.email,
        name: supabaseUser.value.user_metadata?.name || 'Administrador',
        isAdmin: supabaseUser.value.email === 'info@be-mindpower.net',
        source: 'supabase'
      }
    }

    // Usar datos de localStorage como fallback
    if (process.client) {
      const sessionStr = localStorage.getItem('admin_session')
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          if (session.user && session.isAuthenticated) {
            return {
              ...session.user,
              source: 'legacy'
            }
          }
        } catch {
          return null
        }
      }
    }

    return null
  })

  /**
   * Login con Magic Link
   */
  const signInWithMagicLink = async (email: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📧 Enviando Magic Link a:', email)

      const { data, error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      return { 
        success: true, 
        message: 'Magic Link enviado. Revisa tu email.' 
      }

    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login con contraseña (intenta Supabase, fallback a legacy)
   */
  const signInWithPassword = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔐 Intentando login con password...')

      // Intentar con Supabase primero
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (supabaseData.user && !supabaseError) {
        console.log('✅ Login exitoso con Supabase')
        
        // Sincronizar con localStorage para compatibilidad
        if (process.client) {
          const sessionData = {
            user: {
              id: supabaseData.user.id,
              email: supabaseData.user.email,
              name: 'Administrador',
              isAdmin: true
            },
            session: supabaseData.session,
            timestamp: Date.now(),
            isAuthenticated: true
          }
          localStorage.setItem('admin_session', JSON.stringify(sessionData))
          localStorage.setItem('auth_status', 'authenticated')
        }

        return { 
          success: true, 
          user: supabaseData.user,
          source: 'supabase'
        }
      }

      console.log('⚠️ Supabase auth falló, probando sistema legacy...')

      // Fallback al sistema legacy
      const legacyResponse = await $fetch('/api/auth/admin-login', {
        method: 'POST',
        body: { email, password }
      })

      if (!legacyResponse.success) {
        error.value = legacyResponse.error || 'Credenciales inválidas'
        return { success: false, error: legacyResponse.error }
      }

      // Guardar en localStorage
      if (process.client) {
        const sessionData = {
          user: legacyResponse.user,
          session: legacyResponse.session,
          timestamp: Date.now(),
          isAuthenticated: true
        }
        localStorage.setItem('admin_session', JSON.stringify(sessionData))
        localStorage.setItem('auth_status', 'authenticated')
      }

      console.log('✅ Login exitoso con sistema legacy')
      return { 
        success: true, 
        user: legacyResponse.user,
        source: 'legacy'
      }

    } catch (err: any) {
      console.error('💥 Error en login:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cerrar sesión
   */
  const signOut = async () => {
    isLoading.value = true

    try {
      console.log('🚪 Cerrando sesión...')

      // Cerrar sesión en Supabase
      await supabase.auth.signOut()

      // Limpiar localStorage
      if (process.client) {
        localStorage.removeItem('admin_session')
        localStorage.removeItem('auth_status')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')
      }

      console.log('✅ Sesión cerrada')
      
      // Redirigir al login
      await navigateTo('/login')
      
      return { success: true }

    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Test de conexión con Supabase
   */
  const testConnection = async () => {
    try {
      const { data, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      return { 
        success: !testError, 
        error: testError?.message,
        message: testError ? 'Conexión fallida' : 'Conexión exitosa'
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  return {
    // Estado
    isAuthenticated,
    currentUser,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Datos de Supabase
    supabaseUser: readonly(supabaseUser),
    supabaseSession: readonly(supabaseSession),

    // Métodos
    signInWithMagicLink,
    signInWithPassword,
    signOut,
    testConnection,

    // Cliente directo
    supabase
  }
}

