import { getEmailService } from '~/utils/smtp-service'

export default defineEventHandler(async (event) => {
  try {
    const campaignId = getRouterParam(event, 'id')
    
    if (!campaignId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de campaña requerido'
      })
    }

    // Obtener la campaña
    const supabase = useSupabaseClient()
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Campaña no encontrada'
      })
    }

    // Verificar que la campaña esté en estado draft o scheduled
    if (!['draft', 'scheduled'].includes(campaign.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La campaña no puede ser enviada en su estado actual'
      })
    }

    // Obtener contactos activos
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('status', 'active')

    if (contactsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener contactos'
      })
    }

    if (!contacts || contacts.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No hay contactos activos para enviar'
      })
    }

    // Actualizar estado de la campaña
    await supabase
      .from('email_campaigns')
      .update({
        status: 'sending',
        total_recipients: contacts.length,
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    // Crear registros en email_sends para cada contacto
    const sendRecords = contacts.map(contact => ({
      campaign_id: campaignId,
      contact_id: contact.id,
      status: 'queued'
    }))

    const { data: sends, error: sendsError } = await supabase
      .from('email_sends')
      .insert(sendRecords)
      .select()

    if (sendsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear registros de envío'
      })
    }

    // Agregar a la cola de envío
    const queueItems = sends.map(send => ({
      campaign_id: campaignId,
      contact_id: send.contact_id,
      priority: 5,
      retry_count: 0,
      max_retries: 3,
      scheduled_at: new Date().toISOString(),
      status: 'pending'
    }))

    const { error: queueError } = await db.addToQueue(queueItems)

    if (queueError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al agregar a la cola de envío'
      })
    }

    // Iniciar procesamiento de la cola en background
    processEmailQueue(campaignId)

    return {
      success: true,
      message: 'Campaña enviada a la cola de procesamiento',
      data: {
        campaignId,
        totalRecipients: contacts.length,
        status: 'sending'
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})

// Función para procesar la cola de emails en background
async function processEmailQueue(campaignId: string) {
  try {
    const { supabase } = useSupabase()
    const { generateTrackingPixel, processHtmlForClickTracking } = useEmailTracking()
    
    // Obtener elementos pendientes de la cola
    const { data: queueItems, error: queueError } = await db.getQueueItems(['pending'], 50)

    if (queueError || !queueItems) {
      console.error('Error getting queue items:', queueError)
      return
    }

    const campaignItems = queueItems.filter(item => item.campaign_id === campaignId)

    for (const item of campaignItems) {
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

        // Obtener el registro de envío
        const { data: sendRecord } = await supabase
          .from('email_sends')
          .select('*')
          .eq('campaign_id', campaignId)
          .eq('contact_id', contact.id)
          .single()

        if (!sendRecord) {
          throw new Error('Registro de envío no encontrado')
        }

        // Generar URLs de tracking
        const { generateTrackingPixel, processHtmlForClickTracking } = useEmailTracking()
        const trackingPixel = generateTrackingPixel(campaignId, contact.id, sendRecord.id)
        const htmlWithTracking = processHtmlForClickTracking(
          campaign.html_content,
          campaignId,
          contact.id,
          sendRecord.id
        )

        // Personalizar contenido (reemplazar variables)
        const personalizedHtml = personalizeContent(htmlWithTracking, contact)
        const personalizedSubject = personalizeContent(campaign.subject, contact)

        // Obtener servicio de email
        const emailService = getEmailService()

        // Enviar email
        const result = await emailService.sendEmail({
          to: contact.email,
          subject: personalizedSubject,
          htmlContent: personalizedHtml,
          textContent: campaign.text_content,
          fromName: campaign.from_name,
          fromEmail: campaign.from_email,
          replyTo: campaign.reply_to,
          trackingPixel
        })

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
            .eq('id', campaignId)

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
        }

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
      }
    }

    // Verificar si quedan elementos pendientes
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
    } else {
      // Continuar procesando en 1 minuto
      setTimeout(() => processEmailQueue(campaignId), 60000)
    }

  } catch (error) {
    console.error('Error processing email queue:', error)
  }
}

// Función para personalizar contenido
function personalizeContent(content: string, contact: any): string {
  let personalized = content

  // Reemplazar variables comunes
  personalized = personalized.replace(/\{\{first_name\}\}/g, contact.first_name || '')
  personalized = personalized.replace(/\{\{last_name\}\}/g, contact.last_name || '')
  personalized = personalized.replace(/\{\{email\}\}/g, contact.email || '')
  personalized = personalized.replace(/\{\{company\}\}/g, contact.company || '')
  personalized = personalized.replace(/\{\{full_name\}\}/g, 
    [contact.first_name, contact.last_name].filter(Boolean).join(' ') || contact.email
  )

  return personalized
}
