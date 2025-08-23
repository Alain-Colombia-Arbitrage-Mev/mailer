export default defineEventHandler(async (event) => {
  try {
    console.log('Limpiando todas las sesiones bypass...')
    
    // Este endpoint es más para logging/auditoría
    // En un sistema de producción, aquí podrías limpiar tokens de una base de datos
    // Pero las sesiones bypass se almacenan en localStorage del cliente
    
    return {
      success: true,
      message: 'Comando de limpieza de sesiones bypass enviado',
      instruction: 'Los clientes deben limpiar localStorage manualmente',
      timestamp: new Date().toISOString()
    }
    
  } catch (error: any) {
    console.error('Error limpiando sesiones bypass:', error)
    
    return {
      success: false,
      error: 'Error en comando de limpieza',
      timestamp: new Date().toISOString()
    }
  }
})
