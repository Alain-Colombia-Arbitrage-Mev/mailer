export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const startDate = query.start as string
    const endDate = query.end as string

    const supabase = useSupabaseClient()

    // Construir filtros de fecha si se proporcionan
    const dateFilter = (tableName: string) => {
      let filter = supabase.from(tableName)
      if (startDate) {
        filter = filter.gte('created_at', startDate)
      }
      if (endDate) {
        filter = filter.lte('created_at', endDate + 'T23:59:59.999Z')
      }
      return filter
    }

    // Obtener métricas en paralelo
    const [
      campaignsResult,
      contactsResult,
      sendsResult,
      opensResult,
      clicksResult,
      bouncesResult,
      unsubscribesResult,
      recentActivityResult
    ] = await Promise.all([
      // Total de campañas
      dateFilter('email_campaigns')
        .select('id', { count: 'exact' }),

      // Total de contactos activos
      supabase
        .from('contacts')
        .select('id', { count: 'exact' })
        .eq('status', 'active'),

      // Total de emails enviados
      dateFilter('email_sends')
        .select('id', { count: 'exact' })
        .eq('status', 'sent'),

      // Total de aperturas únicas
      dateFilter('email_opens')
        .select('contact_id')
        .then(result => {
          if (result.error) return result
          const uniqueOpens = new Set(result.data?.map(o => o.contact_id) || [])
          return { data: Array.from(uniqueOpens), count: uniqueOpens.size, error: null }
        }),

      // Total de clics únicos
      dateFilter('email_clicks')
        .select('contact_id')
        .then(result => {
          if (result.error) return result
          const uniqueClicks = new Set(result.data?.map(c => c.contact_id) || [])
          return { data: Array.from(uniqueClicks), count: uniqueClicks.size, error: null }
        }),

      // Total de rebotes
      dateFilter('email_sends')
        .select('id', { count: 'exact' })
        .eq('status', 'bounced'),

      // Total de desuscripciones
      supabase
        .from('contacts')
        .select('id', { count: 'exact' })
        .eq('status', 'unsubscribed'),

      // Actividad reciente
      supabase
        .from('email_opens')
        .select(`
          id,
          opened_at,
          contact_id,
          campaign_id,
          contacts(email, first_name, last_name),
          email_campaigns(name)
        `)
        .order('opened_at', { ascending: false })
        .limit(10)
    ])

    // Verificar errores
    const results = [
      campaignsResult,
      contactsResult,
      sendsResult,
      opensResult,
      clicksResult,
      bouncesResult,
      unsubscribesResult,
      recentActivityResult
    ]

    for (const result of results) {
      if (result.error) {
        console.error('Database error:', result.error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Error al obtener métricas'
        })
      }
    }

    // Calcular métricas
    const totalCampaigns = campaignsResult.count || 0
    const totalContacts = contactsResult.count || 0
    const totalEmailsSent = sendsResult.count || 0
    const totalEmailsOpened = opensResult.count || 0
    const totalEmailsClicked = clicksResult.count || 0
    const totalEmailsBounced = bouncesResult.count || 0
    const totalUnsubscribed = unsubscribesResult.count || 0

    const averageOpenRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent) * 100 : 0
    const averageClickRate = totalEmailsSent > 0 ? (totalEmailsClicked / totalEmailsSent) * 100 : 0
    const averageBounceRate = totalEmailsSent > 0 ? (totalEmailsBounced / totalEmailsSent) * 100 : 0

    // Procesar actividad reciente
    const recentActivity = recentActivityResult.data?.map((activity: any) => ({
      id: activity.id,
      type: 'email_opened',
      description: `${activity.contacts?.first_name || activity.contacts?.email} abrió "${activity.email_campaigns?.name}"`,
      timestamp: activity.opened_at,
      metadata: {
        contactId: activity.contact_id,
        campaignId: activity.campaign_id,
        contactEmail: activity.contacts?.email
      }
    })) || []

    // Obtener top campañas por rendimiento
    const { data: topCampaignsData } = await supabase
      .from('email_campaigns')
      .select('id, name, sent_count, opened_count, clicked_count')
      .gt('sent_count', 0)
      .order('opened_count', { ascending: false })
      .limit(5)

    const topCampaigns = topCampaignsData?.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      openRate: campaign.sent_count > 0 ? (campaign.opened_count / campaign.sent_count) * 100 : 0,
      clickRate: campaign.sent_count > 0 ? (campaign.clicked_count / campaign.sent_count) * 100 : 0,
      sent: campaign.sent_count
    })) || []

    const overview = {
      totalCampaigns,
      totalContacts,
      totalEmailsSent,
      totalEmailsOpened,
      totalEmailsClicked,
      totalEmailsBounced,
      totalUnsubscribed,
      averageOpenRate: Math.round(averageOpenRate * 100) / 100,
      averageClickRate: Math.round(averageClickRate * 100) / 100,
      averageBounceRate: Math.round(averageBounceRate * 100) / 100,
      recentActivity,
      topCampaigns
    }

    return {
      success: true,
      data: overview
    }
  } catch (error: any) {
    console.error('Error fetching analytics overview:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})