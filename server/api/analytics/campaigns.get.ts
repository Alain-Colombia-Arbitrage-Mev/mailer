export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const startDate = query.start as string
    const endDate = query.end as string

    if (!startDate || !endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Fechas de inicio y fin requeridas'
      })
    }

    const { supabase } = useSupabase()

    // Obtener campañas en el rango de fechas
    const { data: campaigns, error: campaignsError } = await supabase
      .from('email_campaigns')
      .select('*')
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)
      .in('status', ['sent', 'sending'])
      .order('sent_at', { ascending: false })

    if (campaignsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al obtener campañas'
      })
    }

    if (!campaigns || campaigns.length === 0) {
      return {
        success: true,
        campaigns: []
      }
    }

    // Enriquecer con estadísticas adicionales
    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        // Obtener aperturas únicas
        const { data: uniqueOpens } = await supabase
          .from('email_opens')
          .select('contact_id')
          .eq('campaign_id', campaign.id)

        const uniqueOpenCount = uniqueOpens ? new Set(uniqueOpens.map(o => o.contact_id)).size : 0

        // Obtener clics únicos
        const { data: uniqueClicks } = await supabase
          .from('email_clicks')
          .select('contact_id')
          .eq('campaign_id', campaign.id)

        const uniqueClickCount = uniqueClicks ? new Set(uniqueClicks.map(c => c.contact_id)).size : 0

        // Calcular tasas
        const openRate = campaign.sent_count > 0 ? (campaign.opened_count / campaign.sent_count) * 100 : 0
        const clickRate = campaign.sent_count > 0 ? (campaign.clicked_count / campaign.sent_count) * 100 : 0
        const bounceRate = campaign.sent_count > 0 ? (campaign.bounced_count / campaign.sent_count) * 100 : 0
        const unsubscribeRate = campaign.sent_count > 0 ? (campaign.unsubscribed_count / campaign.sent_count) * 100 : 0
        const deliveryRate = campaign.sent_count > 0 ? (campaign.delivered_count / campaign.sent_count) * 100 : 0

        // Obtener dispositivos más usados para abrir
        const { data: deviceData } = await supabase
          .from('email_opens')
          .select('user_agent')
          .eq('campaign_id', campaign.id)
          .not('user_agent', 'is', null)

        const deviceStats = processDeviceStats(deviceData || [])

        // Obtener ubicaciones de aperturas
        const { data: locationData } = await supabase
          .from('email_opens')
          .select('location')
          .eq('campaign_id', campaign.id)
          .not('location', 'is', null)

        const locationStats = processLocationStats(locationData || [])

        return {
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          sent: campaign.sent_count,
          delivered: campaign.delivered_count,
          opened: campaign.opened_count,
          clicked: campaign.clicked_count,
          bounced: campaign.bounced_count,
          unsubscribed: campaign.unsubscribed_count,
          uniqueOpens: uniqueOpenCount,
          uniqueClicks: uniqueClickCount,
          openRate: Math.round(openRate * 100) / 100,
          clickRate: Math.round(clickRate * 100) / 100,
          bounceRate: Math.round(bounceRate * 100) / 100,
          unsubscribeRate: Math.round(unsubscribeRate * 100) / 100,
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          clickToOpenRate: campaign.opened_count > 0 ? Math.round((campaign.clicked_count / campaign.opened_count) * 100 * 100) / 100 : 0,
          sentAt: campaign.sent_at,
          status: campaign.status,
          deviceStats,
          locationStats
        }
      })
    )

    return {
      success: true,
      campaigns: enrichedCampaigns
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

function processDeviceStats(deviceData: Array<{ user_agent: string }>) {
  const deviceCounts: Record<string, number> = {}
  
  deviceData.forEach(({ user_agent }) => {
    const device = detectDevice(user_agent)
    deviceCounts[device] = (deviceCounts[device] || 0) + 1
  })

  return Object.entries(deviceCounts)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)
}

function processLocationStats(locationData: Array<{ location: any }>) {
  const countryCounts: Record<string, number> = {}
  
  locationData.forEach(({ location }) => {
    if (location?.country) {
      countryCounts[location.country] = (countryCounts[location.country] || 0) + 1
    }
  })

  return Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet'
  } else {
    return 'Desktop'
  }
}
