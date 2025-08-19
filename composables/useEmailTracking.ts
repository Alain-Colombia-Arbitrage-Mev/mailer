import geoip from 'geoip-lite'

export const useEmailTracking = () => {
  const config = useRuntimeConfig()

  /**
   * Genera una URL de tracking para apertura de emails
   */
  const generateTrackingPixel = (campaignId: string, contactId: string, sendId: string) => {
    const baseUrl = config.public.baseUrl
    const params = new URLSearchParams({
      c: campaignId,
      ct: contactId,
      s: sendId,
      t: Date.now().toString()
    })
    
    return `${baseUrl}/api/tracking/open?${params.toString()}`
  }

  /**
   * Genera una URL de tracking para clics en enlaces
   */
  const generateClickTrackingUrl = (originalUrl: string, campaignId: string, contactId: string, sendId: string) => {
    const baseUrl = config.public.baseUrl
    const params = new URLSearchParams({
      url: originalUrl,
      c: campaignId,
      ct: contactId,
      s: sendId,
      t: Date.now().toString()
    })
    
    return `${baseUrl}/api/tracking/click?${params.toString()}`
  }

  /**
   * Procesa el contenido HTML para agregar tracking de clics
   */
  const processHtmlForClickTracking = (htmlContent: string, campaignId: string, contactId: string, sendId: string) => {
    // Regex para encontrar enlaces
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi
    
    return htmlContent.replace(linkRegex, (match, quote, url) => {
      // No trackear enlaces internos o especiales
      if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return match
      }
      
      const trackingUrl = generateClickTrackingUrl(url, campaignId, contactId, sendId)
      return match.replace(url, trackingUrl)
    })
  }

  /**
   * Registra una apertura de email
   */
  const trackEmailOpen = async (campaignId: string, contactId: string, sendId: string, request: any) => {
    try {
      const { supabase } = await import('~/utils/supabase')
      
      // Obtener información del cliente
      const ipAddress = getClientIP(request)
      const userAgent = request.headers['user-agent'] || ''
      const location = getLocationFromIP(ipAddress)

      // Registrar la apertura
      const { error } = await supabase
        .from('email_opens')
        .insert({
          send_id: sendId,
          contact_id: contactId,
          campaign_id: campaignId,
          ip_address: ipAddress,
          user_agent: userAgent,
          location
        })

      if (error) {
        console.error('Error tracking email open:', error)
        return false
      }

      // Actualizar contadores en la campaña
      await updateCampaignOpenCount(campaignId)
      
      // Actualizar estado del envío
      await supabase
        .from('email_sends')
        .update({ status: 'delivered' })
        .eq('id', sendId)
        .eq('status', 'sent')

      return true
    } catch (error) {
      console.error('Error tracking email open:', error)
      return false
    }
  }

  /**
   * Registra un clic en enlace
   */
  const trackEmailClick = async (url: string, campaignId: string, contactId: string, sendId: string, request: any) => {
    try {
      const { supabase } = await import('~/utils/supabase')
      
      // Obtener información del cliente
      const ipAddress = getClientIP(request)
      const userAgent = request.headers['user-agent'] || ''
      const location = getLocationFromIP(ipAddress)

      // Registrar el clic
      const { error } = await supabase
        .from('email_clicks')
        .insert({
          send_id: sendId,
          contact_id: contactId,
          campaign_id: campaignId,
          url,
          ip_address: ipAddress,
          user_agent: userAgent,
          location
        })

      if (error) {
        console.error('Error tracking email click:', error)
        return false
      }

      // Actualizar contadores en la campaña
      await updateCampaignClickCount(campaignId)

      return true
    } catch (error) {
      console.error('Error tracking email click:', error)
      return false
    }
  }

  /**
   * Obtiene estadísticas de tracking para una campaña
   */
  const getCampaignTrackingStats = async (campaignId: string) => {
    try {
      const { supabase } = await import('~/utils/supabase')
      
      // Obtener estadísticas básicas
      const { data: campaign } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (!campaign) return null

      // Obtener aperturas por día
      const { data: opensByDay } = await supabase
        .from('email_opens')
        .select('opened_at')
        .eq('campaign_id', campaignId)

      // Obtener clics por día
      const { data: clicksByDay } = await supabase
        .from('email_clicks')
        .select('clicked_at, url')
        .eq('campaign_id', campaignId)

      // Obtener ubicaciones de aperturas
      const { data: openLocations } = await supabase
        .from('email_opens')
        .select('location')
        .eq('campaign_id', campaignId)
        .not('location', 'is', null)

      // Procesar datos para gráficos
      const opensTimeline = processTimelineData(opensByDay?.map(o => o.opened_at) || [])
      const clicksTimeline = processTimelineData(clicksByDay?.map(c => c.clicked_at) || [])
      const topUrls = processTopUrls(clicksByDay || [])
      const locationStats = processLocationStats(openLocations?.map(l => l.location) || [])

      return {
        campaign,
        opensTimeline,
        clicksTimeline,
        topUrls,
        locationStats,
        metrics: {
          totalSent: campaign.sent_count,
          totalOpened: campaign.opened_count,
          totalClicked: campaign.clicked_count,
          openRate: campaign.sent_count > 0 ? (campaign.opened_count / campaign.sent_count) * 100 : 0,
          clickRate: campaign.sent_count > 0 ? (campaign.clicked_count / campaign.sent_count) * 100 : 0,
          clickToOpenRate: campaign.opened_count > 0 ? (campaign.clicked_count / campaign.opened_count) * 100 : 0
        }
      }
    } catch (error) {
      console.error('Error getting campaign tracking stats:', error)
      return null
    }
  }

  // Funciones auxiliares
  const getClientIP = (request: any) => {
    return request.headers['x-forwarded-for']?.split(',')[0] ||
           request.headers['x-real-ip'] ||
           request.connection?.remoteAddress ||
           request.socket?.remoteAddress ||
           '127.0.0.1'
  }

  const getLocationFromIP = (ip: string) => {
    try {
      const geo = geoip.lookup(ip)
      if (geo) {
        return {
          country: geo.country,
          region: geo.region,
          city: geo.city,
          timezone: geo.timezone,
          coordinates: geo.ll
        }
      }
    } catch (error) {
      console.error('Error getting location from IP:', error)
    }
    return null
  }

  const updateCampaignOpenCount = async (campaignId: string) => {
    const { supabase } = await import('~/utils/supabase')
    
    const { data: openCount } = await supabase
      .from('email_opens')
      .select('id', { count: 'exact' })
      .eq('campaign_id', campaignId)

    await supabase
      .from('email_campaigns')
      .update({ opened_count: openCount?.length || 0 })
      .eq('id', campaignId)
  }

  const updateCampaignClickCount = async (campaignId: string) => {
    const { supabase } = await import('~/utils/supabase')
    
    const { data: clickCount } = await supabase
      .from('email_clicks')
      .select('id', { count: 'exact' })
      .eq('campaign_id', campaignId)

    await supabase
      .from('email_campaigns')
      .update({ clicked_count: clickCount?.length || 0 })
      .eq('id', campaignId)
  }

  const processTimelineData = (timestamps: string[]) => {
    const dayGroups: Record<string, number> = {}
    
    timestamps.forEach(timestamp => {
      const date = new Date(timestamp).toISOString().split('T')[0]
      dayGroups[date] = (dayGroups[date] || 0) + 1
    })

    return Object.entries(dayGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const processTopUrls = (clicks: Array<{ url: string }>) => {
    const urlCounts: Record<string, number> = {}
    
    clicks.forEach(click => {
      urlCounts[click.url] = (urlCounts[click.url] || 0) + 1
    })

    return Object.entries(urlCounts)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  const processLocationStats = (locations: any[]) => {
    const countryStats: Record<string, number> = {}
    const cityStats: Record<string, number> = {}
    
    locations.forEach(location => {
      if (location?.country) {
        countryStats[location.country] = (countryStats[location.country] || 0) + 1
      }
      if (location?.city) {
        const cityKey = `${location.city}, ${location.country}`
        cityStats[cityKey] = (cityStats[cityKey] || 0) + 1
      }
    })

    return {
      countries: Object.entries(countryStats)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      cities: Object.entries(cityStats)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }
  }

  return {
    generateTrackingPixel,
    generateClickTrackingUrl,
    processHtmlForClickTracking,
    trackEmailOpen,
    trackEmailClick,
    getCampaignTrackingStats
  }
}
