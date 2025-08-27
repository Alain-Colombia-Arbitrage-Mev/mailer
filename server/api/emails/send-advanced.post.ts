/**
 * API Route para envío avanzado de emails
 * Soporta envío individual, masivo, y archivos adjuntos desde Supabase Storage
 */

import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

interface EmailAttachment {
  fileName: string
  publicUrl: string
  mimeType: string
  fileSize: number
}

interface SendEmailRequest {
  sendType: 'single' | 'mass'
  recipients: string[]
  subject: string
  content: string
  attachments?: EmailAttachment[]
  sender?: string
}

export default defineEventHandler(async (event) => {
  try {
    console.log('📧 API: Procesando solicitud de envío de email...')

    // Verificar método
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    // Obtener datos del body
    const body = await readBody(event) as SendEmailRequest
    const { sendType, recipients, subject, content, attachments = [], sender } = body

    // Validaciones básicas
    if (!recipients || recipients.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No recipients specified'
      })
    }

    if (!subject || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subject and content are required'
      })
    }

    // Obtener configuración
    const config = useRuntimeConfig()
    
    // Configurar nodemailer
    const transporter = nodemailer.createTransporter({
      host: config.smtpHost,
      port: parseInt(config.smtpPort || '587'),
      secure: false,
      auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    console.log(`📧 Configurando envío ${sendType} para ${recipients.length} destinatario(s)`)

    // Preparar archivos adjuntos si existen
    let processedAttachments: any[] = []
    
    if (attachments && attachments.length > 0) {
      console.log(`📎 Procesando ${attachments.length} archivo(s) adjunto(s)...`)
      
      for (const attachment of attachments) {
        try {
          // Descargar archivo desde Supabase Storage
          const response = await fetch(attachment.publicUrl)
          if (!response.ok) {
            console.warn(`⚠️ No se pudo descargar: ${attachment.fileName}`)
            continue
          }
          
          const buffer = Buffer.from(await response.arrayBuffer())
          
          processedAttachments.push({
            filename: attachment.fileName,
            content: buffer,
            contentType: attachment.mimeType
          })
          
          console.log(`✅ Adjunto procesado: ${attachment.fileName} (${attachment.fileSize} bytes)`)
        } catch (err) {
          console.error(`❌ Error procesando adjunto ${attachment.fileName}:`, err)
        }
      }
    }

    // Preparar opciones de email base
    const baseMailOptions = {
      from: {
        name: config.smtpFromName || 'Be-Mindpower',
        address: config.smtpFromEmail || sender || 'info@be-mindpower.net'
      },
      replyTo: config.smtpReplyTo || config.smtpFromEmail,
      subject,
      html: content.replace(/\n/g, '<br>'),
      text: content,
      attachments: processedAttachments
    }

    const results = []
    let successCount = 0
    let errorCount = 0

    if (sendType === 'single') {
      // Envío individual
      console.log(`📧 Enviando email individual a: ${recipients[0]}`)
      
      try {
        const mailOptions = {
          ...baseMailOptions,
          to: recipients[0]
        }

        const result = await transporter.sendMail(mailOptions)
        
        results.push({
          recipient: recipients[0],
          success: true,
          messageId: result.messageId
        })
        
        successCount++
        console.log(`✅ Email enviado exitosamente a ${recipients[0]}`)
        
      } catch (err: any) {
        console.error(`❌ Error enviando a ${recipients[0]}:`, err)
        results.push({
          recipient: recipients[0],
          success: false,
          error: err.message
        })
        errorCount++
      }
      
    } else {
      // Envío masivo
      console.log(`📧 Iniciando envío masivo a ${recipients.length} destinatarios...`)
      
      // Enviar en lotes para evitar sobrecarga
      const BATCH_SIZE = 10
      const DELAY_BETWEEN_BATCHES = 1000 // 1 segundo
      
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE)
        console.log(`📦 Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(recipients.length / BATCH_SIZE)}`)
        
        const batchPromises = batch.map(async (recipient) => {
          try {
            const mailOptions = {
              ...baseMailOptions,
              to: recipient
            }

            const result = await transporter.sendMail(mailOptions)
            
            results.push({
              recipient,
              success: true,
              messageId: result.messageId
            })
            
            successCount++
            console.log(`✅ Email enviado a ${recipient}`)
            
          } catch (err: any) {
            console.error(`❌ Error enviando a ${recipient}:`, err)
            results.push({
              recipient,
              success: false,
              error: err.message
            })
            errorCount++
          }
        })
        
        // Esperar que termine el lote
        await Promise.all(batchPromises)
        
        // Delay entre lotes (excepto el último)
        if (i + BATCH_SIZE < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
        }
      }
    }

    // Log final
    console.log(`📊 Envío completado: ${successCount} éxitos, ${errorCount} errores`)

    // Guardar estadísticas en Supabase (opcional)
    if (config.public.supabaseUrl && config.supabaseServiceKey) {
      try {
        const supabase = createClient(
          config.public.supabaseUrl,
          config.supabaseServiceKey
        )
        
        await supabase
          .from('email_campaigns')
          .insert({
            sender_email: sender || config.smtpFromEmail,
            subject,
            content,
            recipient_count: recipients.length,
            success_count: successCount,
            error_count: errorCount,
            send_type: sendType,
            attachments_count: attachments.length,
            created_at: new Date().toISOString()
          })
          
        console.log('📊 Estadísticas guardadas en Supabase')
      } catch (err) {
        console.warn('⚠️ No se pudieron guardar estadísticas:', err)
      }
    }

    return {
      success: successCount > 0,
      message: `Email ${sendType === 'mass' ? 'masivo' : ''} procesado`,
      stats: {
        total: recipients.length,
        successful: successCount,
        failed: errorCount,
        attachments: processedAttachments.length
      },
      results: sendType === 'single' ? results : results.slice(0, 10) // Limitar resultados para envío masivo
    }

  } catch (error: any) {
    console.error('💥 Error en API de envío:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error'
    })
  }
})

