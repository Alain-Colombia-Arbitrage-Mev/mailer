export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side rendering
  if (process.server) return

  // Check if user is authenticated
  const storedUser = localStorage.getItem('mailpower_user')
  
  if (!storedUser) {
    // User is not authenticated, redirect to login
    return navigateTo('/login')
  }
  
  try {
    // Validate stored user data
    const user = JSON.parse(storedUser)
    if (!user.email || !user.id) {
      // Invalid user data, remove and redirect to login
      localStorage.removeItem('mailpower_user')
      return navigateTo('/login')
    }
  } catch (error) {
    // Invalid JSON, remove and redirect to login
    localStorage.removeItem('mailpower_user')
    return navigateTo('/login')
  }
})
