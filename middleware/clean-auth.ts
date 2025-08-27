/**
 * Middleware de autenticación SUPER SIMPLE
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // En el servidor, permitir libre navegación
  if (process.server) {
    return
  }

  // Solo ejecutar en el cliente
  if (process.client) {
    try {
      console.log(`🔍 [${new Date().toLocaleTimeString()}] Middleware verificando: ${to.path}`)

      // Verificación DIRECTA de localStorage (más confiable)
      const authStatus = localStorage.getItem('auth_status')
      const adminSession = localStorage.getItem('admin_session')
      
      console.log('🔍 Estado localStorage:', {
        authStatus: authStatus,
        hasSession: !!adminSession,
        path: to.path
      })

      // LÓGICA SUPER SIMPLE: Si hay auth_status = 'authenticated', permitir
      if (authStatus === 'authenticated' && adminSession) {
        try {
          const session = JSON.parse(adminSession)
          const isValidSession = session.isAuthenticated && session.user && session.user.email
          
          if (isValidSession) {
            console.log('✅ [MIDDLEWARE] Usuario autenticado:', session.user.email)
            return // PERMITIR ACCESO
          }
        } catch (parseError) {
          console.error('❌ Error parsing session:', parseError)
        }
      }

      // Si llegamos aquí, NO está autenticado
      console.log('🚫 [MIDDLEWARE] NO autenticado, redirigiendo a /login')
      return navigateTo('/login')

    } catch (error) {
      console.error('❌ Error en middleware:', error)
      return navigateTo('/login')
    }
  }
})
