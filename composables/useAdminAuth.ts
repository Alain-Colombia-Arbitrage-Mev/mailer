export const useAdminAuth = () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()

  // Verificar sesión al inicializar
  const checkSession = async () => {
    isLoading.value = true
    try {
      // Verificar primero si hay una sesión de bypass en localStorage
      if (process.client) {
        const bypassSession = localStorage.getItem('admin_bypass_session')
        if (bypassSession) {
          try {
            const sessionData = JSON.parse(bypassSession)
            // Verificar que la sesión no haya expirado (8 horas)
            const sessionTime = new Date(sessionData.timestamp)
            const now = new Date()
            const diffHours = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60)
            
            if (diffHours < 8) {
              console.log('Sesión bypass válida encontrada')
              user.value = sessionData.user
              return true
            } else {
              console.log('Sesión bypass expirada, eliminando...')
              localStorage.removeItem('admin_bypass_session')
            }
          } catch (parseError) {
            console.error('Error parseando sesión bypass:', parseError)
            localStorage.removeItem('admin_bypass_session')
          }
        }
      }

      // Verificar sesión de Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error obteniendo sesión:', error)
        user.value = null
        return false
      }

      if (session?.user) {
        const userMetadata = session.user.user_metadata
        
        // Verificar que sea administrador
        if (userMetadata?.is_admin && userMetadata?.role === 'admin') {
          user.value = {
            id: session.user.id,
            email: session.user.email,
            name: userMetadata?.name || 'Administrador',
            role: 'admin',
            isAdmin: true
          }
          return true
        } else {
          console.warn('Usuario no tiene permisos de administrador')
          user.value = null
          return false
        }
      }
      
      user.value = null
      return false
    } catch (error) {
      console.error('Error verificando sesión:', error)
      user.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login del administrador
  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      // Intentar primero con bypass (más confiable)
      let response
      try {
        response = await $fetch('/api/auth/admin-login-bypass', {
          method: 'POST',
          body: { email, password }
        })
        console.log('Login bypass exitoso')
      } catch (bypassError) {
        console.log('Bypass falló, intentando con Supabase:', bypassError)
        // Si bypass falla, intentar con Supabase
        response = await $fetch('/api/auth/admin-login', {
          method: 'POST',
          body: { email, password }
        })
      }

      if (response.success && response.user) {
        user.value = response.user
        
        // Si es una sesión de bypass, guardarla en localStorage
        if (response.message?.includes('bypass')) {
          if (process.client) {
            const bypassSessionData = {
              user: response.user,
              timestamp: new Date().toISOString(),
              type: 'bypass'
            }
            localStorage.setItem('admin_bypass_session', JSON.stringify(bypassSessionData))
            console.log('Sesión bypass guardada en localStorage')
          }
        } else if (response.session) {
          // Si hay sesión de Supabase, establecerla en el cliente
          await supabase.auth.setSession(response.session)
        }
        
        // Redirigir al dashboard
        await navigateTo('/dashboard')
        
        return { success: true, message: response.message }
      }

      return { success: false, error: 'Respuesta inválida del servidor' }
    } catch (error: any) {
      console.error('Error en login:', error)
      
      let errorMessage = 'Error de conexión'
      
      if (error.data?.statusMessage) {
        errorMessage = error.data.statusMessage
      } else if (error.statusMessage) {
        errorMessage = error.statusMessage
      } else if (error.message) {
        errorMessage = error.message
      }

      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Logout del administrador
  const logout = async () => {
    isLoading.value = true
    try {
      // Limpiar sesión bypass de localStorage
      if (process.client) {
        localStorage.removeItem('admin_bypass_session')
        console.log('Sesión bypass eliminada de localStorage')
      }
      
      // Cerrar sesión en Supabase
      await supabase.auth.signOut()
      
      user.value = null
      
      // Redirigir al login
      await navigateTo('/auth/admin-login')
      
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      // Limpiar usuario local aunque falle el servidor
      if (process.client) {
        localStorage.removeItem('admin_bypass_session')
      }
      user.value = null
      await navigateTo('/auth/admin-login')
      return { success: false, error: 'Error al cerrar sesión' }
    } finally {
      isLoading.value = false
    }
  }

  // Verificar si es administrador
  const isAdmin = computed(() => {
    return user.value?.role === 'admin' && user.value?.isAdmin === true
  })

  // Obtener información del usuario
  const getUserInfo = () => {
    return {
      id: user.value?.id,
      email: user.value?.email,
      name: user.value?.name,
      role: user.value?.role,
      isAdmin: user.value?.isAdmin,
      loginTime: user.value?.loginTime
    }
  }

  // Inicializar verificación de sesión automáticamente
  const initialize = async () => {
    if (process.client) {
      await checkSession()
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    isAdmin,
    login,
    logout,
    checkSession,
    initialize,
    getUserInfo
  }
}
