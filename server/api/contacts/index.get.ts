export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const page = parseInt(queryParams.page as string) || 1
    const limit = Math.min(parseInt(queryParams.limit as string) || 50, 100) // Máximo 100
    const search = queryParams.search as string || ''
    const sortBy = queryParams.sortBy as string || 'created_at'
    const sortOrder = queryParams.sortOrder as string || 'desc'
    
    const filters = {
      status: queryParams.status as string,
      tags: queryParams.tags ? (queryParams.tags as string).split(',') : undefined,
      company: queryParams.company as string,
      created_after: queryParams.created_after as string,
      created_before: queryParams.created_before as string
    }

    const supabase = useSupabaseClient()
    
    // Construir query base
    let queryBuilder = supabase
      .from('contacts')
      .select(`
        *,
        contact_tags(
          tag_id,
          tags(id, name, color)
        )
      `, { count: 'exact' })

    // Aplicar búsqueda
    if (search) {
      queryBuilder = queryBuilder.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company.ilike.%${search}%`
      )
    }

    // Aplicar filtros
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status)
    }

    if (filters.company) {
      queryBuilder = queryBuilder.ilike('company', `%${filters.company}%`)
    }

    if (filters.created_after) {
      queryBuilder = queryBuilder.gte('created_at', filters.created_after)
    }

    if (filters.created_before) {
      queryBuilder = queryBuilder.lte('created_at', filters.created_before)
    }

    // Aplicar ordenamiento
    const validSortFields = ['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'company']
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

    // Filtrar por tags si se especifica (se hace después porque es una relación)
    let filteredData = data || []
    if (filters.tags && filters.tags.length > 0) {
      filteredData = filteredData.filter(contact => {
        const contactTags = contact.contact_tags?.map((ct: any) => ct.tags.id) || []
        return filters.tags!.some(tagId => contactTags.includes(tagId))
      })
    }

    // Procesar datos para incluir tags de forma más limpia
    const processedData = filteredData.map(contact => ({
      ...contact,
      tags: contact.contact_tags?.map((ct: any) => ct.tags) || []
    }))

    return {
      success: true,
      data: processedData,
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
        ...filters,
        sortBy: sortField,
        sortOrder
      }
    }
  } catch (error: any) {
    console.error('Error fetching contacts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})
