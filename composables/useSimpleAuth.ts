import { AuthSession } from '../utils/auth-session'

export const useSimpleAuth = () => {
  const checkAuth = () => {
    // Solo ejecutar en el cliente
    if (process.server) return true
    
    const isAuth = AuthSession.isAuthenticated()
    if (!isAuth) {
      console.log('🚫 No autenticado, redirigiendo a login...')
      window.location.replace('/auth/simple-login')
      return false
    }
    
    console.log('✅ Usuario autenticado')
    return true
  }
  
  const getUser = () => {
    if (process.server) return null
    return AuthSession.getUser()
  }
  
  const logout = () => {
    console.log('👋 Cerrando sesión...')
    AuthSession.clear()
    window.location.replace('/auth/simple-login')
  }
  
  const requireAuth = () => {
    // Para usar en onMounted
    if (process.client) {
      setTimeout(() => {
        checkAuth()
      }, 100)
    }
  }
  
  return {
    checkAuth,
    getUser,
    logout,
    requireAuth,
    isAuthenticated: () => process.client ? AuthSession.isAuthenticated() : false
  }
}