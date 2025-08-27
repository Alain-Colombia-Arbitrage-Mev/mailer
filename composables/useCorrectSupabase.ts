/**
 * Composable que fuerza la URL CORRECTA de Supabase
 * Evita problemas de cache del módulo @nuxtjs/supabase
 */

import { createClient } from '@supabase/supabase-js'

// URL CORRECTA - NUNCA cambiar esta
const CORRECT_SUPABASE_URL = 'https://hxmdzhkkuhsetqucbpia.supabase.co'
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'

export const useCorrectSupabase = () => {
  const ADMIN_EMAIL = 'info@be-mindpower.net'
  // Crear cliente manual con URL correcta
  const correctSupabaseClient = createClient(CORRECT_SUPABASE_URL, CORRECT_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })

  // Estados reactivos propios (sin depender de Nuxt)
  const supabaseUser = ref(null)
  const supabaseSession = ref(null)

  // Log para debugging
  if (process.client) {
    console.log('🔧 URLs de Supabase:')
    console.log('📍 Cliente correcto:', CORRECT_SUPABASE_URL)
    
    // Obtener sesión inicial del cliente correcto
    correctSupabaseClient.auth.getSession().then(({ data: { session } }) => {
      supabaseSession.value = session
      supabaseUser.value = session?.user || null
      console.log('📍 Usuario inicial cliente correcto:', supabaseUser.value?.email || 'No hay usuario')
    })

    // Escuchar cambios de autenticación
    correctSupabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state cambió:', event, session?.user?.email)
      supabaseSession.value = session
      supabaseUser.value = session?.user || null
      
      // Sincronizar con localStorage para compatibilidad
      if (session?.user) {
        const sessionData = {
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            isAdmin: session.user.email === 'info@be-mindpower.net'
          },
          session: session,
          timestamp: Date.now(),
          isAuthenticated: true
        }
        localStorage.setItem('admin_session', JSON.stringify(sessionData))
        localStorage.setItem('auth_status', 'authenticated')
      } else {
        localStorage.removeItem('admin_session')
        localStorage.removeItem('auth_status')
      }
    })
  }

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Login con Magic Link usando cliente correcto
   */
  const signInWithMagicLink = async (email: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📧 Enviando Magic Link con cliente correcto a:', email)

      const { data, error: authError } = await correctSupabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `http://localhost:3001/auth/callback`
        }
      })

      if (authError) {
        console.error('❌ Error con cliente correcto:', authError)
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      console.log('✅ Magic Link enviado con cliente correcto')
      return { 
        success: true, 
        message: 'Magic Link enviado. Revisa tu email.' 
      }

    } catch (err: any) {
      console.error('💥 Error en Magic Link:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login con contraseña usando cliente correcto
   */
  const signInWithPassword = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔐 Login con cliente correcto para:', email)

      // Intentar con cliente correcto PRIMERO
      const { data: correctData, error: correctError } = await correctSupabaseClient.auth.signInWithPassword({
        email,
        password
      })

      if (correctData.user && !correctError) {
        console.log('✅ Login exitoso con cliente correcto')
        
        // Sincronizar con localStorage
        if (process.client) {
          const sessionData = {
            user: {
              id: correctData.user.id,
              email: correctData.user.email,
              name: 'Administrador',
              isAdmin: true
            },
            session: correctData.session,
            timestamp: Date.now(),
            isAuthenticated: true
          }
          localStorage.setItem('admin_session', JSON.stringify(sessionData))
          localStorage.setItem('auth_status', 'authenticated')
        }

        return { 
          success: true, 
          user: correctData.user,
          source: 'supabase-correct'
        }
      }

      console.log('⚠️ Cliente correcto falló, probando sistema legacy...')

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
      console.error('💥 Error en login con cliente correcto:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Estado de autenticación unificado
   */
  const isAuthenticated = computed(() => {
    // Verificar múltiples fuentes para asegurar consistencia
    const hasSupabaseUser = !!supabaseUser.value
    let hasLocalStorage = false
    
    if (process.client) {
      const authStatus = localStorage.getItem('auth_status')
      const adminSession = localStorage.getItem('admin_session')
      hasLocalStorage = authStatus === 'authenticated' && !!adminSession
    }
    
    const result = hasSupabaseUser || hasLocalStorage
    console.log('🔍 isAuthenticated check:', {
      hasSupabaseUser,
      hasLocalStorage,
      result,
      userEmail: supabaseUser.value?.email
    })
    
    return result
  })

  /**
   * Usuario actual unificado
   */
  const currentUser = computed(() => {
    if (supabaseUser.value) {
      return {
        id: supabaseUser.value.id,
        email: supabaseUser.value.email,
        name: supabaseUser.value.user_metadata?.full_name || supabaseUser.value.email,
        isAdmin: supabaseUser.value.email === ADMIN_EMAIL,
        source: 'supabase-correct'
      }
    }
    return null
  })

  /**
   * Cerrar sesión
   */
  const signOut = async () => {
    isLoading.value = true
    
    try {
      console.log('🚪 Cerrando sesión...')

      // Cerrar en cliente correcto
      try {
        await correctSupabaseClient.auth.signOut()
        console.log('✅ Sesión cerrada en cliente correcto')
      } catch (err) {
        console.warn('⚠️ Error cerrando sesión en cliente correcto:', err)
      }

      // Cerrar en cliente de Nuxt también
      try {
        await nuxtSupabaseClient.auth.signOut()
        console.log('✅ Sesión cerrada en cliente Nuxt')
      } catch (err) {
        console.warn('⚠️ Error cerrando sesión en cliente Nuxt:', err)
      }

      // Limpiar localStorage
      if (process.client) {
        localStorage.removeItem('admin_session')
        localStorage.removeItem('auth_status')
        localStorage.removeItem('user_email')
        localStorage.removeItem('user_role')
      }

      console.log('✅ Sesión cerrada completamente')
      
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
   * Test de conexión con cliente correcto
   */
  const testConnection = async () => {
    try {
      console.log('🧪 Probando conexión con cliente correcto...')
      
      const { data, error: testError } = await correctSupabaseClient
        .from('mailing_contacts')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('❌ Error con cliente correcto:', testError)
        return { 
          success: false, 
          error: testError.message,
          message: 'Conexión fallida con cliente correcto'
        }
      }

      console.log('✅ Conexión exitosa con cliente correcto')
      return { 
        success: true, 
        message: 'Conexión exitosa con cliente correcto' 
      }
    } catch (err: any) {
      console.error('💥 Error probando conexión:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    // Estado
    isAuthenticated,
    currentUser,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Datos del cliente correcto
    supabaseUser: readonly(supabaseUser),
    supabaseSession: readonly(supabaseSession),

    // Métodos
    signInWithMagicLink,
    signInWithPassword,
    signOut,
    testConnection,

    // Cliente correcto
    correctSupabaseClient
  }
}
