import { AuthSession } from '../utils/auth-session'

export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (process.server) return

  // Crear un estado global reactivo para la autenticación
  const authState = reactive({
    isAuthenticated: false,
    user: null as any
  })

  // Función para verificar autenticación
  const checkAuth = () => {
    const session = AuthSession.get()
    authState.isAuthenticated = session !== null
    authState.user = session?.user || null
    return authState.isAuthenticated
  }

  // Función para hacer login
  const login = (sessionData: any) => {
    AuthSession.save(sessionData)
    authState.isAuthenticated = true
    authState.user = sessionData.user
  }

  // Función para hacer logout
  const logout = () => {
    AuthSession.clear()
    authState.isAuthenticated = false
    authState.user = null
    window.location.replace('/auth/simple-login')
  }

  // Función para requerir autenticación
  const requireAuth = () => {
    if (!checkAuth()) {
      console.log('🚫 No autenticado, redirigiendo a login...')
      window.location.replace('/auth/simple-login')
      return false
    }
    return true
  }

  // Verificar autenticación al cargar
  checkAuth()

  // Proporcionar las funciones globalmente
  return {
    provide: {
      authState,
      checkAuth,
      login,
      logout,
      requireAuth
    }
  }
})