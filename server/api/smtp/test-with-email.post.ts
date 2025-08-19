import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body
    
    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email es requerido'
      })
    }
    
    console.log('🧪 Probando conexión SMTP enviando email real a:', email)
    
    // Obtener servicio de email
    const emailService = getEmailService()
    
    // Probar conexión enviando email real
    const result = await emailService.testConnectionWithEmail(email)
    
    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      message: result.success 
        ? 'Email de prueba enviado exitosamente. Revisa tu bandeja de entrada.' 
        : 'Error enviando email de prueba'
    }
    
  } catch (error: any) {
    console.error('💥 Error en test con email:', error)
    
    return {
      success: false,
      error: error.message || 'Error desconocido'
    }
  }
})


