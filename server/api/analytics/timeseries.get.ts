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

    // Generar array de fechas entre start y end
    const dates = []
    const currentDate = new Date(startDate)
    const finalDate = new Date(endDate)

    while (currentDate <= finalDate) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Obtener datos por día
    const timeSeriesData = await Promise.all(
      dates.map(async (date) => {
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)
        const nextDateStr = nextDate.toISOString().split('T')[0]

        const [sendsResult, opensResult, clicksResult, bouncesResult] = await Promise.all([
          // Emails enviados
          supabase
            .from('email_sends')
            .select('id', { count: 'exact' })
            .gte('sent_at', date)
            .lt('sent_at', nextDateStr)
            .in('status', ['sent', 'delivered']),

          // Aperturas
          supabase
            .from('email_opens')
            .select('id', { count: 'exact' })
            .gte('opened_at', date)
            .lt('opened_at', nextDateStr),

          // Clics
          supabase
            .from('email_clicks')
            .select('id', { count: 'exact' })
            .gte('clicked_at', date)
            .lt('clicked_at', nextDateStr),

          // Bounces
          supabase
            .from('email_sends')
            .select('id', { count: 'exact' })
            .gte('sent_at', date)
            .lt('sent_at', nextDateStr)
            .eq('status', 'bounced')
        ])

        return {
          date,
          sent: sendsResult.count || 0,
          opened: opensResult.count || 0,
          clicked: clicksResult.count || 0,
          bounced: bouncesResult.count || 0
        }
      })
    )

    return {
      success: true,
      data: timeSeriesData
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
