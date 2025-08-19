export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validar datos requeridos
    if (!body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El email es requerido'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de email inválido'
      })
    }

    const supabase = useSupabaseClient()

    // Verificar si el email ya existe
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', body.email.toLowerCase().trim())
      .single()

    if (existingContact) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ya existe un contacto con este email'
      })
    }

    // Crear contacto
    const contactData = {
      email: body.email.toLowerCase().trim(),
      first_name: body.first_name?.trim() || null,
      last_name: body.last_name?.trim() || null,
      phone: body.phone?.trim() || null,
      company: body.company?.trim() || null,
      status: body.status || 'active',
      metadata: body.metadata || {}
    }

    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single()

    if (contactError) {
      throw createError({
        statusCode: 400,
        statusMessage: contactError.message
      })
    }

    // Asignar tags si se proporcionan
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      const tagAssignments = body.tags.map((tagId: string) => ({
        contact_id: contact.id,
        tag_id: tagId
      }))

      const { error: tagsError } = await supabase
        .from('contact_tags')
        .insert(tagAssignments)

      if (tagsError) {
        console.error('Error assigning tags:', tagsError)
        // No fallar la creación del contacto por error en tags
      }
    }

    // Obtener el contacto completo con tags
    const { data: fullContact } = await supabase
      .from('contacts')
      .select(`
        *,
        contact_tags(
          tag_id,
          tags(id, name, color)
        )
      `)
      .eq('id', contact.id)
      .single()

    const processedContact = {
      ...fullContact,
      tags: fullContact?.contact_tags?.map((ct: any) => ct.tags) || []
    }

    return {
      success: true,
      data: processedContact,
      message: 'Contacto creado exitosamente'
    }
  } catch (error: any) {
    console.error('Error creating contact:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor'
    })
  }
})
