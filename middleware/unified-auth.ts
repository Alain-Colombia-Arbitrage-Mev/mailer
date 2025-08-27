/**
 * Middleware unificado de autenticación
 * Maneja tanto usuarios normales como administradores
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  
  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/contacts',
    '/campaigns',
    '/templates',
    '/emails',
    '/analytics',
    '/settings',
    '/profile'
  ]
  
  // Rutas de autenticación (no requieren estar logueado)
  const authRoutes = [
    '/auth/login',
    '/auth/callback',
    '/auth/register-admin',
    '/auth/admin-login',
    '/'
  ]
  
  const currentPath = to.path
  const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route))
  const isAuthRoute = authRoutes.includes(currentPath)
  
  // Si intenta acceder a ruta protegida sin autenticación
  if (isProtectedRoute && !user.value) {
    return navigateTo('/auth/login')
  }
  
  // Si está autenticado e intenta acceder a rutas de auth
  if (user.value && isAuthRoute && currentPath !== '/') {
    return navigateTo('/dashboard')
  }
  
  // Verificar permisos de admin para rutas específicas
  const adminOnlyRoutes = ['/analytics', '/settings']
  if (adminOnlyRoutes.some(route => currentPath.startsWith(route))) {
    const metadata = user.value?.user_metadata
    if (!metadata?.is_admin || metadata?.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos para acceder a esta página'
      })
    }
  }
})