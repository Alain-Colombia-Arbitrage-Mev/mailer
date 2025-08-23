export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecutar en el cliente después de la hidratación
  if (process.server) return

  const { initialize, isAuthenticated, checkSession } = useAdminAuth()
  
  try {
    // Inicializar y verificar sesión del administrador
    await initialize()
    
    // Verificar que tenemos una sesión válida después de la inicialización
    if (!isAuthenticated.value) {
      console.log('No hay sesión válida de administrador, redirigiendo al login')
      return navigateTo('/auth/admin-login')
    }
    
    console.log('Middleware admin: Acceso autorizado')
    
  } catch (error) {
    console.error('Error en middleware admin:', error)
    return navigateTo('/auth/admin-login')
  }
})
