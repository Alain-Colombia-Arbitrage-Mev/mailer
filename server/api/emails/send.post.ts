import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('📨 Datos recibidos en API:', {
      recipients: body.recipients?.length || 0,
      subject: body.subject,
      contentLength: body.content?.length || 0,
      attachmentsCount: body.attachments?.length || 0,
      attachmentsInfo: body.attachments?.map(att => ({
        filename: att.filename,
        hasContent: !!att.content,
        hasUrl: !!att.url,
        contentType: att.contentType
      })) || []
    })
    
    // Validar datos requeridos
    if (!body.recipients || !Array.isArray(body.recipients) || body.recipients.length === 0) {
      console.error('❌ Recipients inválidos:', body.recipients)
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipients are required and must be an array'
      })
    }
    
    if (!body.subject || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subject and content are required'
      })
    }

    const {
      recipients,
      subject,
      content,
      isHtml = false,
      attachments = [],
      sender = 'noreply@be-mindpower.net'
    } = body

    console.log('📧 Configuración de envío:', {
      recipients: recipients.length,
      recipientsList: recipients,
      subject,
      contentLength: content.length,
      isHtml,
      attachments: attachments.length,
      sender
    })

    // Procesar adjuntos si los hay
    const processedAttachments = []
    if (attachments && attachments.length > 0) {
      console.log('📎 Procesando adjuntos...')
      
      for (const attachment of attachments) {
        try {
          if (attachment.url) {
            // Si el adjunto tiene URL, descargarlo
            console.log(`📥 Descargando adjunto desde URL: ${attachment.filename}`)
            const response = await fetch(attachment.url)
            if (response.ok) {
              const buffer = Buffer.from(await response.arrayBuffer())
              processedAttachments.push({
                filename: attachment.filename,
                content: buffer,
                contentType: attachment.contentType
              })
              console.log(`✅ Adjunto descargado: ${attachment.filename} (${buffer.length} bytes)`)
            } else {
              console.error(`❌ Error descargando adjunto: ${attachment.filename}`)
            }
          } else if (attachment.content) {
            // Si ya tiene contenido, usarlo directamente
            processedAttachments.push({
              filename: attachment.filename,
              content: Buffer.from(attachment.content, 'base64'),
              contentType: attachment.contentType
            })
            console.log(`✅ Adjunto procesado desde contenido: ${attachment.filename}`)
          }
        } catch (error) {
          console.error(`❌ Error procesando adjunto ${attachment.filename}:`, error)
        }
      }
    }

    // Obtener servicio de email
    const emailService = getEmailService()
    console.log('📬 Servicio de email obtenido')
    
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
          attachments: processedAttachments,
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

    // Registrar en base de datos (opcional)
    try {
      const { supabase } = useSupabaseMaster()
      
      // Registrar cada envío
      for (const result of results) {
        await supabase.from('email_logs').insert({
          recipient_email: result.recipient,
          subject,
          content,
          message_id: result.messageId,
          status: 'sent',
          sender_email: sender,
          sent_at: new Date().toISOString()
        })
      }
      
      // Registrar errores
      for (const error of errors) {
        await supabase.from('email_logs').insert({
          recipient_email: error.recipient,
          subject,
          content,
          status: 'failed',
          error_message: error.error,
          sender_email: sender,
          sent_at: new Date().toISOString()
        })
      }
    } catch (dbError) {
      console.error('Error registrando en base de datos:', dbError)
      // No fallar el envío por errores de BD
    }

    return {
      success: true,
      sent: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error: any) {
    console.error('💥 Error en API de envío:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error'
    })
  }
})

