export default defineEventHandler(async (event) => {
  return {
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  }
})
