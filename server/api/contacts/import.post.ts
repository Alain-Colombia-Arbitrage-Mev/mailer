import { useDatabase, type Contact } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.contacts || !Array.isArray(body.contacts)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Se requiere un array de contactos'
      })
    }

    if (body.contacts.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El array de contactos no puede estar vacío'
      })
    }

    if (body.contacts.length > 1000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Máximo 1000 contactos por importación'
      })
    }

    const results = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    for (const contactData of body.contacts) {
      try {
        // Validar email
        if (!contactData.email) {
          results.push({
            email: contactData.email || 'N/A',
            success: false,
            error: 'Email requerido'
          })
          continue
        }

        if (!emailRegex.test(contactData.email)) {
          results.push({
            email: contactData.email,
            success: false,
            error: 'Formato de email inválido'
          })
          continue
        }

        const cleanContactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'> = {
          email: contactData.email.toLowerCase().trim(),
          first_name: contactData.first_name?.trim() || null,
          last_name: contactData.last_name?.trim() || null,
          phone: contactData.phone?.trim() || null,
          company: contactData.company?.trim() || null,
          status: contactData.status || 'active',
          metadata: contactData.metadata || {}
        }

        const db = useDatabase()
        const { data, error } = await db.createContact(cleanContactData)

        if (error) {
          let errorMessage = error.message
          if (error.code === '23505') {
            errorMessage = 'Email ya existe'
          }
          
          results.push({
            email: contactData.email,
            success: false,
            error: errorMessage
          })
        } else {
          results.push({
            email: contactData.email,
            success: true,
            data
          })
        }

        // Pequeña pausa para evitar sobrecargar la base de datos
        await new Promise(resolve => setTimeout(resolve, 10))
        
      } catch (error: any) {
        results.push({
          email: contactData.email || 'N/A',
          success: false,
          error: error.message || 'Error desconocido'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return {
      success: true,
      summary: {
        total: results.length,
        imported: successCount,
        errors: errorCount
      },
      results
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
