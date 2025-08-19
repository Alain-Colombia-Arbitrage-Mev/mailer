export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user.value) {
    return navigateTo('/dashboard')
  }
})
