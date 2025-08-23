export default defineNuxtPlugin(async () => {
  // Solo ejecutar en el cliente
  if (process.server) return

  const { initialize } = useAdminAuth()
  
  try {
    // Inicializar verificación de sesión de administrador
    await initialize()
    console.log('Plugin admin-auth: Inicialización completada')
  } catch (error) {
    console.error('Plugin admin-auth: Error en inicialización:', error)
  }
})
