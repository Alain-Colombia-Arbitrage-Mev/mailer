import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 Verificando estado de AWS SES...')
    
    // Obtener servicio de email
    const emailService = getEmailService()
    
    // Intentar verificar conexión
    const connectionTest = await emailService.verifyConnection()
    
    // Intentar enviar un email de prueba a un email conocido
    const testResult = await emailService.sendEmail({
      to: 'info@be-mindpower.net', // Enviar a la misma dirección
      from: 'info@be-mindpower.net',
      subject: 'Test AWS SES Status',
      html: '<h1>Test de Estado de AWS SES</h1><p>Este es un email de prueba para verificar el estado de AWS SES.</p>',
      text: 'Test de Estado de AWS SES\n\nEste es un email de prueba para verificar el estado de AWS SES.'
    })
    
    return {
      success: true,
      connectionVerified: connectionTest,
      testEmailSent: testResult.success,
      testEmailError: testResult.error,
      testMessageId: testResult.messageId,
      recommendations: [
        connectionTest ? '✅ Conexión SMTP exitosa' : '❌ Conexión SMTP falló',
        testResult.success ? '✅ Email de prueba enviado' : '❌ Email de prueba falló',
        'Verifica en AWS SES Console:',
        '1. Si estás en Sandbox mode',
        '2. Si info@be-mindpower.net está verificado',
        '3. Si el dominio be-mindpower.net está verificado',
        '4. Los límites de envío actuales'
      ]
    }
    
  } catch (error: any) {
    console.error('💥 Error verificando estado SES:', error)
    
    return {
      success: false,
      error: error.message,
      recommendations: [
        'Verifica las credenciales SMTP',
        'Verifica que AWS SES esté configurado correctamente',
        'Verifica que el dominio/email esté verificado en AWS SES'
      ]
    }
  }
})


