export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validar datos requeridos
    const requiredFields = ['name', 'subject', 'html_content', 'from_name', 'from_email']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `El campo ${field} es requerido`
        })
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.from_email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido en from_email'
      })
    }

    if (body.reply_to && !emailRegex.test(body.reply_to)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido en reply_to'
      })
    }

    const supabase = useSupabaseClient()

    // Preparar datos de la campaña
    const campaignData = {
      name: body.name.trim(),
      subject: body.subject.trim(),
      template_id: body.template_id || null,
      html_content: body.html_content,
      text_content: body.text_content || null,
      from_name: body.from_name.trim(),
      from_email: body.from_email.toLowerCase().trim(),
      reply_to: body.reply_to ? body.reply_to.toLowerCase().trim() : null,
      status: body.status || 'draft',
      scheduled_at: body.scheduled_at || null,
      total_recipients: 0,
      sent_count: 0,
      delivered_count: 0,
      opened_count: 0,
      clicked_count: 0,
      bounced_count: 0,
      unsubscribed_count: 0
    }

    // Validar fecha de programación si se proporciona
    if (campaignData.scheduled_at) {
      const scheduledDate = new Date(campaignData.scheduled_at)
      const now = new Date()
      
      if (scheduledDate <= now) {
        throw createError({
          statusCode: 400,
          statusMessage: 'La fecha de programación debe ser futura'
        })
      }
      
      campaignData.status = 'scheduled'
    }

    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert(campaignData)
      .select()
      .single()

    if (campaignError) {
      throw createError({
        statusCode: 400,
        statusMessage: campaignError.message
      })
    }

    return {
      success: true,
      data: campaign,
      message: 'Campaña creada exitosamente'
    }
  } catch (error: any) {
    console.error('Error creating campaign:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})

