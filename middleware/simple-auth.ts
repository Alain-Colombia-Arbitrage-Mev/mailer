export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.server) return

  // Verificación síncrona de autenticación
  if (process.client) {
    try {
      console.log('🔍 Simple-auth middleware ejecutándose para:', to.path)
      
      const sessionStr = localStorage.getItem('admin_session')
      console.log('📦 Datos en localStorage:', sessionStr ? 'Encontrados' : 'No encontrados')
      
      if (!sessionStr) {
        console.log('🚫 No hay sesión, redirigiendo a login...')
        return navigateTo('/auth/simple-login')
      }

      const session = JSON.parse(sessionStr)
      console.log('👤 Datos de sesión:', {
        hasUser: !!session.user,
        userEmail: session.user?.email,
        isAdmin: session.user?.isAdmin,
        timestamp: session.timestamp,
        age: Date.now() - (session.timestamp || 0)
      })
      
      // Verificar que la sesión no haya expirado (24 horas)
      const now = Date.now()
      const sessionAge = now - (session.timestamp || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas en ms
      
      if (sessionAge > maxAge) {
        console.log('🕒 Sesión expirada, eliminando y redirigiendo...')
        localStorage.removeItem('admin_session')
        return navigateTo('/auth/simple-login')
      }

      // Verificar que el usuario sea admin
      if (!session.user || !session.user.isAdmin) {
        console.log('🚫 Usuario no admin, redirigiendo a login...', {
          hasUser: !!session.user,
          isAdmin: session.user?.isAdmin
        })
        return navigateTo('/auth/simple-login')
      }
      
      console.log('✅ Usuario autenticado, permitiendo acceso a:', to.path)
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error)
      localStorage.removeItem('admin_session')
      return navigateTo('/auth/simple-login')
    }
  }
})