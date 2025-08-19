export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { c: campaignId, ct: contactId, s: sendId } = query

    if (!campaignId || !contactId) {
      // Devolver pixel transparente incluso si faltan parámetros
      return sendPixelResponse(event)
    }

    // Obtener información del cliente
    const ipAddress = getClientIP(event.node.req)
    const userAgent = getHeader(event, 'user-agent') || ''

    // Usar el composable de tracking
    const { trackEmailOpen } = useEmailTracking()
    
    // Registrar la apertura (no bloquear la respuesta)
    trackEmailOpen(
      campaignId as string,
      contactId as string,
      sendId as string,
      event.node.req
    ).catch(error => {
      console.error('Error tracking email open:', error)
    })

    // Devolver pixel transparente inmediatamente
    return sendPixelResponse(event)
  } catch (error) {
    console.error('Error in tracking open endpoint:', error)
    return sendPixelResponse(event)
  }
})

/**
 * Envía un pixel transparente de 1x1
 */
function sendPixelResponse(event: any) {
  // Pixel transparente de 1x1 en base64
  const pixelData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  )

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Content-Length', pixelData.length.toString())
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  return pixelData
}

/**
 * Obtiene la IP del cliente considerando proxies
 */
function getClientIP(req: any): string {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.headers['cf-connecting-ip'] || // Cloudflare
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         '127.0.0.1'
}