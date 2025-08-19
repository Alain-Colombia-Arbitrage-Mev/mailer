import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    // Leer el FormData
    const formData = await readMultipartFormData(event)
    
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se recibieron datos'
      })
    }

    console.log('📨 FormData recibido con', formData.length, 'campos')

    // Extraer datos del formulario
    let recipients = []
    let subject = ''
    let content = ''
    let isHtml = false
    let sender = 'info@be-mindpower.net'
    const attachments = []

    for (const field of formData) {
      const fieldName = field.name || ''
      
      if (fieldName === 'recipients') {
        recipients = JSON.parse(field.data.toString())
      } else if (fieldName === 'subject') {
        subject = field.data.toString()
      } else if (fieldName === 'content') {
        content = field.data.toString()
      } else if (fieldName === 'isHtml') {
        isHtml = field.data.toString() === 'true'
      } else if (fieldName === 'sender') {
        sender = field.data.toString()
      } else if (fieldName.startsWith('attachment_')) {
        // Es un archivo adjunto
        attachments.push({
          filename: field.filename || 'attachment',
          content: field.data,
          contentType: field.type || 'application/octet-stream'
        })
        console.log(`📎 Adjunto recibido: ${field.filename} (${field.data.length} bytes)`)
      }
    }

    console.log('📧 Datos procesados:', {
      recipients: recipients.length,
      subject,
      contentLength: content.length,
      isHtml,
      attachmentsCount: attachments.length,
      sender
    })

    // Validar datos requeridos
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipients are required and must be an array'
      })
    }
    
    if (!subject || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subject and content are required'
      })
    }

    // Obtener servicio de email
    const emailService = getEmailService()
    
    // Enviar email a cada destinatario
    const results = []
    const errors = []

    for (const recipient of recipients) {
      try {
        console.log(`📤 Enviando a: ${recipient}`)
        
        const result = await emailService.sendEmail({
          to: recipient,
          subject,
          html: isHtml ? content : undefined,
          text: !isHtml ? content : undefined,
          attachments: attachments,
          from: sender
        })

        if (result.success) {
          results.push({
            recipient,
            messageId: result.messageId,
            status: 'sent'
          })
          console.log(`✅ Enviado a ${recipient}: ${result.messageId}`)
        } else {
          errors.push({
            recipient,
            error: result.error || 'Unknown error'
          })
          console.error(`❌ Error enviando a ${recipient}:`, result.error)
        }
      } catch (error: any) {
        errors.push({
          recipient,
          error: error.message
        })
        console.error(`💥 Excepción enviando a ${recipient}:`, error)
      }
    }

    return {
      success: true,
      sent: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error: any) {
    console.error('💥 Error en API de envío con archivos:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error'
    })
  }
})


