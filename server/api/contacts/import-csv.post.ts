import Papa from 'papaparse'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se encontró archivo'
      })
    }

    const file = formData.find(item => item.name === 'file')
    const tagsParam = formData.find(item => item.name === 'tags')
    const defaultTags = tagsParam ? JSON.parse(tagsParam.data.toString()) : []

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Archivo requerido'
      })
    }

    // Validar tipo de archivo
    const allowedTypes = ['text/csv', 'application/csv', 'text/plain', 'application/vnd.ms-excel']
    const fileName = file.filename?.toLowerCase() || ''
    const isValidType = allowedTypes.includes(file.type || '') || fileName.endsWith('.csv')

    if (!isValidType) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Solo se permiten archivos CSV'
      })
    }

    // Parsear CSV
    const csvContent = file.data.toString('utf-8')
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim().replace(/\s+/g, '_')
    })

    if (parseResult.errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Error parseando CSV: ${parseResult.errors[0].message}`
      })
    }

    const rows = parseResult.data as any[]
    const results = {
      total: rows.length,
      imported: 0,
      skipped: 0,
      errors: [] as string[],
      duplicates: 0
    }

    const supabase = useSupabaseClient()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const processedEmails = new Set<string>()

    // Procesar en lotes para mejor rendimiento
    const batchSize = 50
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const validContacts = []

      for (let j = 0; j < batch.length; j++) {
        const row = batch[j]
        const rowIndex = i + j + 2 // +2 porque empezamos en fila 2 (header es fila 1)

        // Mapear campos comunes
        const email = (row.email || row.correo || row.e_mail)?.toLowerCase().trim()
        
        // Validar email requerido
        if (!email) {
          results.errors.push(`Fila ${rowIndex}: Email requerido`)
          results.skipped++
          continue
        }

        // Validar formato de email
        if (!emailRegex.test(email)) {
          results.errors.push(`Fila ${rowIndex}: Formato de email inválido (${email})`)
          results.skipped++
          continue
        }

        // Verificar duplicados en el mismo archivo
        if (processedEmails.has(email)) {
          results.errors.push(`Fila ${rowIndex}: Email duplicado en el archivo`)
          results.skipped++
          continue
        }

        processedEmails.add(email)

        // Preparar datos del contacto
        const contactData = {
          email,
          first_name: (row.first_name || row.nombre || row.name)?.trim() || null,
          last_name: (row.last_name || row.apellido || row.surname)?.trim() || null,
          phone: (row.phone || row.telefono || row.tel)?.trim() || null,
          company: (row.company || row.empresa || row.organization)?.trim() || null,
          status: 'active',
          metadata: {
            imported: true,
            import_date: new Date().toISOString(),
            import_row: rowIndex,
            ...Object.fromEntries(
              Object.entries(row).filter(([key, value]) => 
                !['email', 'first_name', 'last_name', 'phone', 'company'].includes(key) && 
                value !== null && 
                value !== undefined && 
                value !== ''
              )
            )
          }
        }

        validContacts.push({ contactData, rowIndex, tags: defaultTags })
      }

      // Verificar emails existentes en lote
      if (validContacts.length > 0) {
        const emails = validContacts.map(c => c.contactData.email)
        const { data: existingContacts } = await supabase
          .from('contacts')
          .select('email')
          .in('email', emails)

        const existingEmails = new Set(existingContacts?.map(c => c.email) || [])

        // Filtrar contactos que no existen
        const newContacts = validContacts.filter(({ contactData, rowIndex }) => {
          if (existingEmails.has(contactData.email)) {
            results.errors.push(`Fila ${rowIndex}: Email ya existe en la base de datos`)
            results.duplicates++
            results.skipped++
            return false
          }
          return true
        })

        // Insertar contactos nuevos
        if (newContacts.length > 0) {
          const { data: insertedContacts, error: insertError } = await supabase
            .from('contacts')
            .insert(newContacts.map(c => c.contactData))
            .select('id, email')

          if (insertError) {
            console.error('Batch insert error:', insertError)
            newContacts.forEach(({ rowIndex }) => {
              results.errors.push(`Fila ${rowIndex}: Error al insertar - ${insertError.message}`)
              results.skipped++
            })
          } else {
            results.imported += insertedContacts?.length || 0

            // Asignar tags si se especificaron
            if (defaultTags.length > 0 && insertedContacts) {
              const tagAssignments = insertedContacts.flatMap(contact => 
                defaultTags.map((tagId: string) => ({
                  contact_id: contact.id,
                  tag_id: tagId
                }))
              )

              if (tagAssignments.length > 0) {
                const { error: tagsError } = await supabase
                  .from('contact_tags')
                  .insert(tagAssignments)

                if (tagsError) {
                  console.error('Error assigning tags to imported contacts:', tagsError)
                }
              }
            }
          }
        }
      }
    }

    return {
      success: true,
      results: {
        ...results,
        message: `Importación completada: ${results.imported} contactos importados, ${results.skipped} omitidos`
      }
    }
  } catch (error: any) {
    console.error('Import error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error interno del servidor'
    })
  }
})

