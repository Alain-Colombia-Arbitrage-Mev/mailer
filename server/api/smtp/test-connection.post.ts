import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔌 Probando conexión SMTP...')
    
    // Obtener servicio de email
    const emailService = getEmailService()
    
    // Verificar conexión
    const isConnected = await emailService.verifyConnection()
    
    if (isConnected) {
      console.log('✅ Conexión SMTP exitosa')
      return {
        success: true,
        message: 'Conexión SMTP verificada correctamente',
        config: {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 587,
          user: 'info@be-mindpower.net',
          secure: false
        }
      }
    } else {
      console.log('❌ Error en conexión SMTP')
      return {
        success: false,
        error: 'No se pudo verificar la conexión SMTP'
      }
    }
    
  } catch (error: any) {
    console.error('💥 Error probando conexión SMTP:', error)
    
    return {
      success: false,
      error: error.message || 'Error desconocido al probar conexión SMTP'
    }
  }
})


