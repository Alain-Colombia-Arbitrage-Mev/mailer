import { useDatabase } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const contactId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!contactId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de contacto requerido'
      })
    }

    // Validar email si se proporciona
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Formato de email inválido'
        })
      }
      body.email = body.email.toLowerCase().trim()
    }

    // Limpiar campos de texto
    if (body.first_name) body.first_name = body.first_name.trim()
    if (body.last_name) body.last_name = body.last_name.trim()
    if (body.phone) body.phone = body.phone.trim()
    if (body.company) body.company = body.company.trim()

    const db = useDatabase()
    const { data, error } = await db.updateContact(parseInt(contactId), body)

    if (error) {
      if (error.code === '23505') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Ya existe un contacto con este email'
        })
      }
      
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Contacto no encontrado'
      })
    }

    return {
      success: true,
      data
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
