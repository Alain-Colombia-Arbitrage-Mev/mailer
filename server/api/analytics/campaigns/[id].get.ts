export default defineEventHandler(async (event) => {
  try {
    const campaignId = getRouterParam(event, 'id')
    const query = getQuery(event)
    const startDate = query.start as string
    const endDate = query.end as string

    if (!campaignId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de campaña requerido'
      })
    }

    const supabase = useSupabaseClient()

    // Obtener información de la campaña
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

    // Construir filtros de fecha
    const dateFilter = (query: any) => {
      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate + 'T23:59:59.999Z')
      }
      return query
    }

    // Obtener métricas detalladas en paralelo
    const [
      sendsResult,
      opensResult,
      clicksResult,
      bouncesResult,
      unsubscribesResult
    ] = await Promise.all([
      // Envíos
      dateFilter(supabase
        .from('email_sends')
        .select('id, status, sent_at, delivered_at')
        .eq('campaign_id', campaignId)),

      // Aperturas con detalles
      dateFilter(supabase
        .from('email_opens')
        .select('id, contact_id, opened_at, ip_address, user_agent, location')
        .eq('campaign_id', campaignId)),

      // Clics con detalles
      dateFilter(supabase
        .from('email_clicks')
        .select('id, contact_id, clicked_at, url, ip_address, user_agent, location')
        .eq('campaign_id', campaignId)),

      // Rebotes
      dateFilter(supabase
        .from('email_sends')
        .select('id, error_message')
        .eq('campaign_id', campaignId)
        .eq('status', 'bounced')),

      // Desuscripciones (contactos que se desuscribieron después del envío)
      supabase
        .from('contacts')
        .select('id, updated_at')
        .eq('status', 'unsubscribed')
        .gte('updated_at', campaign.sent_at || campaign.created_at)
    ])

    // Verificar errores
    const results = [sendsResult, opensResult, clicksResult, bouncesResult, unsubscribesResult]
    for (const result of results) {
      if (result.error) {
        console.error('Database error:', result.error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Error al obtener datos de la campaña'
        })
      }
    }

    const sends = sendsResult.data || []
    const opens = opensResult.data || []
    const clicks = clicksResult.data || []
    const bounces = bouncesResult.data || []
    const unsubscribes = unsubscribesResult.data || []

    // Calcular métricas básicas
    const totalSent = sends.filter(s => s.status === 'sent').length
    const totalDelivered = sends.filter(s => s.status === 'delivered' || s.delivered_at).length
    const totalOpened = opens.length
    const totalClicked = clicks.length
    const totalBounced = bounces.length
    const totalUnsubscribed = unsubscribes.length

    const uniqueOpens = new Set(opens.map(o => o.contact_id)).size
    const uniqueClicks = new Set(clicks.map(c => c.contact_id)).size

    const openRate = totalSent > 0 ? (uniqueOpens / totalSent) * 100 : 0
    const clickRate = totalSent > 0 ? (uniqueClicks / totalSent) * 100 : 0
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0
    const unsubscribeRate = totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0
    const clickToOpenRate = uniqueOpens > 0 ? (uniqueClicks / uniqueOpens) * 100 : 0
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0

    // Generar timeline de actividad (agrupado por día)
    const timelineData: Record<string, { opens: number; clicks: number }> = {}
    
    opens.forEach(open => {
      const date = new Date(open.opened_at).toISOString().split('T')[0]
      if (!timelineData[date]) {
        timelineData[date] = { opens: 0, clicks: 0 }
      }
      timelineData[date].opens++
    })

    clicks.forEach(click => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0]
      if (!timelineData[date]) {
        timelineData[date] = { opens: 0, clicks: 0 }
      }
      timelineData[date].clicks++
    })

    const timeline = Object.entries(timelineData)
      .map(([date, data]) => ({
        date,
        opens: data.opens,
        clicks: data.clicks
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top enlaces más clicados
    const urlCounts: Record<string, { clicks: number; uniqueClicks: Set<string> }> = {}
    clicks.forEach(click => {
      if (!urlCounts[click.url]) {
        urlCounts[click.url] = { clicks: 0, uniqueClicks: new Set() }
      }
      urlCounts[click.url].clicks++
      urlCounts[click.url].uniqueClicks.add(click.contact_id)
    })

    const topLinks = Object.entries(urlCounts)
      .map(([url, data]) => ({
        url,
        clicks: data.clicks,
        uniqueClicks: data.uniqueClicks.size
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    // Análisis geográfico
    const locationCounts: Record<string, { opens: number; clicks: number }> = {}
    
    opens.forEach(open => {
      if (open.location?.country) {
        const country = open.location.country
        if (!locationCounts[country]) {
          locationCounts[country] = { opens: 0, clicks: 0 }
        }
        locationCounts[country].opens++
      }
    })

    clicks.forEach(click => {
      if (click.location?.country) {
        const country = click.location.country
        if (!locationCounts[country]) {
          locationCounts[country] = { opens: 0, clicks: 0 }
        }
        locationCounts[country].clicks++
      }
    })

    const locations = Object.entries(locationCounts)
      .map(([country, data]) => ({
        country,
        opens: data.opens,
        clicks: data.clicks
      }))
      .sort((a, b) => b.opens - a.opens)
      .slice(0, 10)

    // Análisis de dispositivos (basado en user agent)
    const deviceCounts: Record<string, number> = {}
    opens.forEach(open => {
      if (open.user_agent) {
        let deviceType = 'Desktop'
        const ua = open.user_agent.toLowerCase()
        
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
          deviceType = 'Mobile'
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
          deviceType = 'Tablet'
        }
        
        deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1
      }
    })

    const devices = Object.entries(deviceCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    // Actividad por hora del día
    const hourlyActivity: Record<number, { opens: number; clicks: number }> = {}
    for (let i = 0; i < 24; i++) {
      hourlyActivity[i] = { opens: 0, clicks: 0 }
    }

    opens.forEach(open => {
      const hour = new Date(open.opened_at).getHours()
      hourlyActivity[hour].opens++
    })

    clicks.forEach(click => {
      const hour = new Date(click.clicked_at).getHours()
      hourlyActivity[hour].clicks++
    })

    const hourlyActivityArray = Object.entries(hourlyActivity)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        opens: data.opens,
        clicks: data.clicks
      }))

    const analytics = {
      campaignId,
      campaignName: campaign.name,
      status: campaign.status,
      totalSent,
      totalOpened,
      totalClicked,
      totalBounced,
      totalUnsubscribed,
      uniqueOpens,
      uniqueClicks,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      bounceRate: Math.round(bounceRate * 100) / 100,
      unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
      clickToOpenRate: Math.round(clickToOpenRate * 100) / 100,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      timeline,
      topLinks,
      locations,
      devices,
      hourlyActivity: hourlyActivityArray
    }

    return {
      success: true,
      data: analytics
    }
  } catch (error: any) {
    console.error('Error fetching campaign analytics:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})

