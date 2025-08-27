/**
 * Composable para manejar contactos desde la tabla USERS de Supabase
 */

export const useSupabaseContacts = () => {
  // Usar cliente con URL correcta forzada
  const { correctSupabaseClient } = useCorrectSupabase()
  const supabase = correctSupabaseClient
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Obtener todos los contactos de la tabla contacts
   */
  const getAllContacts = async () => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📋 Obteniendo contactos de tabla mailing_contacts de Supabase...')

      const { data, error: supabaseError } = await supabase
        .from('mailing_contacts')
        .select('*')
        .eq('status', 'active') // Solo contactos activos
        .order('created_at', { ascending: false })

      if (supabaseError) {
        console.error('❌ Error obteniendo contactos:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message, contacts: [] }
      }

      console.log(`✅ Contactos obtenidos: ${data.length}`)
      return { success: true, contacts: data || [] }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, contacts: [] }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtener contactos con filtros
   */
  const getContactsFiltered = async (filters: {
    search?: string
    limit?: number
    offset?: number
  } = {}) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔍 Obteniendo contactos filtrados:', filters)

      let query = supabase
        .from('mailing_contacts')
        .select('*')
        .eq('status', 'active')

      // Aplicar búsqueda si existe
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
      }

      // Aplicar límite y offset
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        console.error('❌ Error obteniendo contactos filtrados:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message, contacts: [] }
      }

      console.log(`✅ Contactos filtrados obtenidos: ${data.length}`)
      return { success: true, contacts: data || [] }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, contacts: [] }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtener un contacto por ID
   */
  const getContactById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('mailing_contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (supabaseError) {
        console.error('❌ Error obteniendo contacto:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message, contact: null }
      }

      return { success: true, contact: data }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, contact: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crear un nuevo contacto
   */
  const createContact = async (contactData: {
    email: string
    first_name?: string
    last_name?: string
    phone?: string
    company?: string
    metadata?: any
  }) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('➕ Creando contacto:', contactData.email)

      const { data, error: supabaseError } = await supabase
        .from('mailing_contacts')
        .insert([{
          email: contactData.email,
          first_name: contactData.first_name,
          last_name: contactData.last_name,
          phone: contactData.phone,
          company: contactData.company,
          status: 'active',
          metadata: contactData.metadata || {},
          subscribed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Error creando contacto:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message, contact: null }
      }

      console.log('✅ Contacto creado exitosamente')
      return { success: true, contact: data }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, contact: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Actualizar un contacto
   */
  const updateContact = async (id: string, updates: {
    email?: string
    first_name?: string
    last_name?: string
    phone?: string
    company?: string
    status?: string
    metadata?: any
  }) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('📝 Actualizando contacto:', id)

      const updateData: any = {}
      if (updates.email) updateData.email = updates.email
      if (updates.first_name) updateData.first_name = updates.first_name
      if (updates.last_name) updateData.last_name = updates.last_name
      if (updates.phone) updateData.phone = updates.phone
      if (updates.company) updateData.company = updates.company
      if (updates.status) updateData.status = updates.status
      if (updates.metadata) updateData.metadata = updates.metadata

      const { data, error: supabaseError } = await supabase
        .from('mailing_contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        console.error('❌ Error actualizando contacto:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message, contact: null }
      }

      console.log('✅ Contacto actualizado exitosamente')
      return { success: true, contact: data }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, contact: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Eliminar un contacto
   */
  const deleteContact = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🗑️ Eliminando contacto:', id)

      const { error: supabaseError } = await supabase
        .from('mailing_contacts')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        console.error('❌ Error eliminando contacto:', supabaseError)
        error.value = supabaseError.message
        return { success: false, error: supabaseError.message }
      }

      console.log('✅ Contacto eliminado exitosamente')
      return { success: true }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtener estadísticas de contactos
   */
  const getContactsStats = async () => {
    try {
      const { count, error: supabaseError } = await supabase
        .from('mailing_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      if (supabaseError) {
        console.error('❌ Error obteniendo estadísticas:', supabaseError)
        return { success: false, error: supabaseError.message, total: 0 }
      }

      return { success: true, total: count || 0 }

    } catch (err: any) {
      console.error('💥 Error:', err)
      return { success: false, error: err.message, total: 0 }
    }
  }

  return {
    // Estado
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Métodos
    getAllContacts,
    getContactsFiltered,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getContactsStats
  }
}
