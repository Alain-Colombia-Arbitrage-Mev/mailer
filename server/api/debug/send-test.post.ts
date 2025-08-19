import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { to, subject = 'Test Email', content = 'This is a test email' } = body
    
    console.log('🧪 DEBUG: Enviando email de prueba...')
    console.log('🧪 DEBUG: Destinatario:', to)
    console.log('🧪 DEBUG: Asunto:', subject)
    
    // Obtener servicio de email
    const emailService = getEmailService()
    
    // Primero verificar conexión
    console.log('🧪 DEBUG: Verificando conexión...')
    const isConnected = await emailService.verifyConnection()
    
    if (!isConnected) {
      console.error('🧪 DEBUG: ❌ Conexión SMTP falló')
      return {
        success: false,
        error: 'Conexión SMTP falló',
        step: 'connection'
      }
    }
    
    console.log('🧪 DEBUG: ✅ Conexión SMTP exitosa')
    
    // Enviar email
    console.log('🧪 DEBUG: Enviando email...')
    const result = await emailService.sendEmail({
      to: to,
      subject: subject,
      html: `<h1>Email de Prueba</h1><p>${content}</p><p>Enviado desde el sistema de debug.</p>`,
      text: `Email de Prueba\n\n${content}\n\nEnviado desde el sistema de debug.`
    })
    
    console.log('🧪 DEBUG: Resultado del envío:', result)
    
    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      step: result.success ? 'sent' : 'failed',
      debug: {
        connectionVerified: isConnected,
        smtpConfig: {
          host: 'email-smtp.us-east-1.amazonaws.com',
          port: 587,
          user: 'info@be-mindpower.net'
        }
      }
    }
    
  } catch (error: any) {
    console.error('🧪 DEBUG: 💥 Error en envío de prueba:', error)
    
    return {
      success: false,
      error: error.message,
      step: 'exception',
      stack: error.stack
    }
  }
})


