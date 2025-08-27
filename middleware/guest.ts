export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (process.server) return

  // Usar el sistema unificado
  const { isAuthenticated } = useCorrectSupabase()
  
  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated.value) {
    console.log('👤 Usuario ya autenticado, redirigiendo al dashboard desde guest middleware')
    return navigateTo('/dashboard')
  }
  
  console.log('🚪 Usuario no autenticado, permitiendo acceso a página guest')
})
