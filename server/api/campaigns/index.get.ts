export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = Math.min(parseInt(query.limit as string) || 20, 100)
    const search = query.search as string || ''
    const status = query.status as string || ''
    const sortBy = query.sortBy as string || 'created_at'
    const sortOrder = query.sortOrder as string || 'desc'

    const supabase = useSupabaseClient()

    // Construir query base
    let queryBuilder = supabase
      .from('email_campaigns')
      .select('*', { count: 'exact' })

    // Aplicar búsqueda
    if (search) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${search}%,subject.ilike.%${search}%`
      )
    }

    // Aplicar filtros
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    // Aplicar ordenamiento
    const validSortFields = ['created_at', 'updated_at', 'name', 'status', 'sent_at', 'sent_count']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const ascending = sortOrder === 'asc'

    queryBuilder = queryBuilder.order(sortField, { ascending })

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data, error, count } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: (page * limit) < (count || 0),
        hasPrev: page > 1
      },
      filters: {
        search,
        status,
        sortBy: sortField,
        sortOrder
      }
    }
  } catch (error: any) {
    console.error('Error fetching campaigns:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})

