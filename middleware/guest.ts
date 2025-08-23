export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecutar en el cliente
  if (process.server) return

  const { checkSession } = useAdminAuth()
  
  try {
    const hasValidSession = await checkSession()
    
    if (hasValidSession) {
      return navigateTo('/dashboard')
    }
  } catch (error) {
    // Si hay error verificando la sesión, permitir acceso a la página de guest
    console.log('No hay sesión válida, permitiendo acceso a página guest')
  }
})
