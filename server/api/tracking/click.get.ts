export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { url, c: campaignId, ct: contactId, s: sendId } = query

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL parameter is required'
      })
    }

    // Validar que la URL sea segura
    const targetUrl = decodeURIComponent(url as string)
    if (!isValidUrl(targetUrl)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL'
      })
    }

    // Si tenemos datos de tracking, registrar el clic
    if (campaignId && contactId) {
      const { trackEmailClick } = useEmailTracking()
      
      // Registrar el clic (no bloquear la redirección)
      trackEmailClick(
        targetUrl,
        campaignId as string,
        contactId as string,
        sendId as string,
        event.node.req
      ).catch(error => {
        console.error('Error tracking email click:', error)
      })
    }

    // Redirigir al usuario a la URL original
    await sendRedirect(event, targetUrl, 302)
  } catch (error) {
    console.error('Error in tracking click endpoint:', error)
    
    // En caso de error, intentar redirigir a la URL si está disponible
    const query = getQuery(event)
    const url = query.url as string
    
    if (url && isValidUrl(decodeURIComponent(url))) {
      await sendRedirect(event, decodeURIComponent(url), 302)
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error'
      })
    }
  }
})

/**
 * Valida si una URL es segura para redirección
 */
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    
    // Solo permitir HTTP y HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false
    }

    // Evitar URLs maliciosas o de localhost en producción
    const hostname = parsedUrl.hostname.toLowerCase()
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment) {
      // En producción, evitar localhost y IPs privadas
      if (hostname === 'localhost' || 
          hostname === '127.0.0.1' ||
          hostname.startsWith('192.168.') ||
          hostname.startsWith('10.') ||
          hostname.startsWith('172.')) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}