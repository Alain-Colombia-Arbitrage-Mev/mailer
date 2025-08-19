import { useDatabase } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const contactId = getRouterParam(event, 'id')

    if (!contactId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de contacto requerido'
      })
    }

    const db = useDatabase()
    const { error } = await db.deleteContact(parseInt(contactId))

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      message: 'Contacto eliminado exitosamente'
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
