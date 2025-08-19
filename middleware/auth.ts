export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // If user is not logged in and trying to access protected route
  if (!user.value && to.path !== '/auth/login' && to.path !== '/auth/register' && to.path !== '/auth/callback' && to.path !== '/') {
    return navigateTo('/auth/login')
  }

  // If user is logged in and trying to access auth pages
  if (user.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/dashboard')
  }
})
