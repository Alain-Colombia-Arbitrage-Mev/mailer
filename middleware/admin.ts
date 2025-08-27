export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo para rutas del dashboard admin
  if (!to.path.startsWith('/dashboard')) return
  
  console.log('🔍 Admin middleware: Verificando acceso...')
  
  // Por ahora, permitir acceso si el usuario hizo login exitoso
  // Esto es temporal hasta que el sistema de auth esté completamente integrado
  return
})
