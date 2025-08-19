export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { campaignId, batchSize = 50 } = body

    const supabase = useSupabaseClient()
    const { getEmailService } = await import('~/utils/aws-ses')

    // Obtener elementos pendientes de la cola
    let queueQuery = supabase
      .from('email_queue')
      .select(`
        *,
        email_campaigns(*),
        contacts(*)
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true })
      .limit(batchSize)

    if (campaignId) {
      queueQuery = queueQuery.eq('campaign_id', campaignId)
    }

    const { data: queueItems, error: queueError } = await queueQuery

    if (queueError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener elementos de la cola'
      })
    }

    if (!queueItems || queueItems.length === 0) {
      return {
        success: true,
        message: 'No hay elementos pendientes en la cola',
        processed: 0
      }
    }

    const emailService = getEmailService()
    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Procesar cada elemento de la cola
    for (const item of queueItems) {
      try {
        // Marcar como procesando
        await supabase
          .from('email_queue')
          .update({ status: 'processing' })
          .eq('id', item.id)

        const campaign = item.email_campaigns
        const contact = item.contacts

        if (!campaign || !contact) {
          throw new Error('Datos de campaña o contacto faltantes')
        }

        // Obtener o crear registro de envío
        let { data: sendRecord, error: sendError } = await supabase
          .from('email_sends')
          .select('*')
          .eq('campaign_id', campaign.id)
          .eq('contact_id', contact.id)
          .single()

        if (sendError && sendError.code !== 'PGRST116') {
          throw new Error(`Error al obtener registro de envío: ${sendError.message}`)
        }

        if (!sendRecord) {
          const { data: newSend, error: createSendError } = await supabase
            .from('email_sends')
            .insert({
              campaign_id: campaign.id,
              contact_id: contact.id,
              status: 'queued'
            })
            .select()
            .single()

          if (createSendError) {
            throw new Error(`Error al crear registro de envío: ${createSendError.message}`)
          }

          sendRecord = newSend
        }

        // Generar contenido con tracking
        const { processEmailContent } = useEmailTracking()
        const trackingData = {
          campaignId: campaign.id,
          contactId: contact.id,
          sendId: sendRecord.id
        }

        const htmlWithTracking = processEmailContent(campaign.html_content, trackingData)
        
        // Personalizar contenido
        const personalizedHtml = personalizeContent(htmlWithTracking, contact)
        const personalizedSubject = personalizeContent(campaign.subject, contact)

        // Enviar email
        const emailData = {
          to: contact.email,
          subject: personalizedSubject,
          htmlContent: personalizedHtml,
          textContent: campaign.text_content || '',
          fromName: campaign.from_name,
          fromEmail: campaign.from_email,
          replyTo: campaign.reply_to
        }

        const result = await emailService.sendEmail(emailData)

        if (result.success) {
          // Actualizar registro de envío
          await supabase
            .from('email_sends')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              message_id: result.messageId
            })
            .eq('id', sendRecord.id)

          // Marcar como completado en la cola
          await supabase
            .from('email_queue')
            .update({ status: 'completed' })
            .eq('id', item.id)

          // Actualizar contador de la campaña
          await supabase
            .from('email_campaigns')
            .update({ 
              sent_count: supabase.sql`sent_count + 1`
            })
            .eq('id', campaign.id)

          results.sent++
        } else {
          // Manejar error de envío
          await supabase
            .from('email_sends')
            .update({
              status: 'failed',
              error_message: result.error
            })
            .eq('id', sendRecord.id)

          // Incrementar retry count o marcar como fallido
          if (item.retry_count < item.max_retries) {
            await supabase
              .from('email_queue')
              .update({
                status: 'pending',
                retry_count: item.retry_count + 1,
                scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Reintentar en 5 minutos
              })
              .eq('id', item.id)
          } else {
            await supabase
              .from('email_queue')
              .update({
                status: 'failed',
                error_message: result.error
              })
              .eq('id', item.id)
          }

          results.failed++
          results.errors.push(`${contact.email}: ${result.error}`)
        }

        results.processed++

        // Rate limiting - SES permite 14 emails por segundo
        await new Promise(resolve => setTimeout(resolve, 80))

      } catch (error: any) {
        console.error('Error processing queue item:', error)
        
        // Marcar como fallido
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', item.id)

        results.failed++
        results.errors.push(`Error procesando: ${error.message}`)
      }
    }

    // Verificar si la campaña está completa
    if (campaignId) {
      const { data: remainingItems } = await supabase
        .from('email_queue')
        .select('id')
        .eq('campaign_id', campaignId)
        .in('status', ['pending', 'processing'])

      if (!remainingItems || remainingItems.length === 0) {
        // Campaña completada
        await supabase
          .from('email_campaigns')
          .update({ status: 'sent' })
          .eq('id', campaignId)
      }
    }

    return {
      success: true,
      message: `Procesamiento completado: ${results.sent} enviados, ${results.failed} fallidos`,
      data: results
    }
  } catch (error: any) {
    console.error('Error processing email queue:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})

/**
 * Personaliza el contenido reemplazando variables
 */
function personalizeContent(content: string, contact: any): string {
  let personalized = content

  // Reemplazar variables comunes
  personalized = personalized.replace(/\{\{first_name\}\}/g, contact.first_name || '')
  personalized = personalized.replace(/\{\{last_name\}\}/g, contact.last_name || '')
  personalized = personalized.replace(/\{\{email\}\}/g, contact.email || '')
  personalized = personalized.replace(/\{\{company\}\}/g, contact.company || '')
  personalized = personalized.replace(/\{\{phone\}\}/g, contact.phone || '')
  
  // Nombre completo
  const fullName = [contact.first_name, contact.last_name]
    .filter(Boolean)
    .join(' ') || contact.email || 'Usuario'
  
  personalized = personalized.replace(/\{\{full_name\}\}/g, fullName)

  // Variables de metadatos si existen
  if (contact.metadata && typeof contact.metadata === 'object') {
    Object.entries(contact.metadata).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      personalized = personalized.replace(regex, String(value || ''))
    })
  }

  return personalized
}

