import type { MailingContact, Campaign, EmailTemplate, EmailLog } from '~/utils/supabase-schema'
import { supabaseHelpers } from '~/utils/supabase-schema'

export const useMailingSystem = () => {
  const supabase = useSupabaseClient()

  // Estados reactivos
  const contacts = ref<MailingContact[]>([])
  const campaigns = ref<Campaign[]>([])
  const templates = ref<EmailTemplate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Funciones para contactos
  const fetchContacts = async (limit = 50) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabaseHelpers.getMailingContacts(supabase, limit)
      
      if (fetchError) {
        error.value = fetchError.message
        return { success: false, error: fetchError.message }
      }

      contacts.value = data || []
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const createContact = async (contactData: Partial<MailingContact>) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabaseHelpers.createMailingContact(supabase, contactData)
      
      if (createError) {
        error.value = createError.message
        return { success: false, error: createError.message }
      }

      // Actualizar la lista local
      if (data && data[0]) {
        contacts.value.unshift(data[0])
      }

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Funciones para campañas
  const fetchCampaigns = async (limit = 20) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabaseHelpers.getCampaigns(supabase, limit)
      
      if (fetchError) {
        error.value = fetchError.message
        return { success: false, error: fetchError.message }
      }

      campaigns.value = data || []
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabaseHelpers.createCampaign(supabase, campaignData)
      
      if (createError) {
        error.value = createError.message
        return { success: false, error: createError.message }
      }

      // Actualizar la lista local
      if (data && data[0]) {
        campaigns.value.unshift(data[0])
      }

      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Funciones para plantillas
  const fetchTemplates = async (limit = 10) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabaseHelpers.getEmailTemplates(supabase, limit)
      
      if (fetchError) {
        error.value = fetchError.message
        return { success: false, error: fetchError.message }
      }

      templates.value = data || []
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Funciones para estadísticas
  const getCampaignStats = async (campaignId: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await supabaseHelpers.getCampaignStats(supabase, campaignId)
      return { success: true, data: result }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Función para probar la conexión
  const testConnection = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🧪 Probando conexión con esquema real...')
      
      // Probar acceso a email_templates
      const { data, error: testError } = await supabase
        .from('email_templates')
        .select('id, name')
        .limit(1)

      if (testError) {
        console.error('❌ Error de conexión:', testError)
        error.value = testError.message
        return { success: false, error: testError.message }
      }

      console.log('✅ Conexión exitosa al esquema real')
      console.log('📊 Plantillas encontradas:', data?.length || 0)
      
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error de conexión:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Función para enviar Magic Link (usando el esquema de auth de Supabase)
  const sendMagicLink = async (email: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('📧 Enviando Magic Link a:', email)
      
      const { data, error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true
        }
      })

      if (authError) {
        console.error('❌ Error de auth:', authError)
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      console.log('✅ Magic Link enviado exitosamente')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error al enviar Magic Link:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estados
    contacts: readonly(contacts),
    campaigns: readonly(campaigns),
    templates: readonly(templates),
    loading: readonly(loading),
    error: readonly(error),

    // Funciones
    fetchContacts,
    createContact,
    fetchCampaigns,
    createCampaign,
    fetchTemplates,
    getCampaignStats,
    testConnection,
    sendMagicLink
  }
}

