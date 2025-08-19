import { defineStore } from 'pinia'
import type { Campaign, EmailTemplate, User as Contact } from '~/utils/supabase-schema'

export interface CampaignFormData {
  name: string
  subject: string
  template_id?: string
  html_content: string
  text_content?: string
  from_name: string
  from_email: string
  reply_to?: string
  scheduled_at?: string
  recipients: {
    type: 'all' | 'tags' | 'selected'
    tags?: string[]
    contacts?: string[]
  }
}

export interface CampaignsState {
  campaigns: Campaign[]
  templates: EmailTemplate[]
  currentCampaign: Campaign | null
  campaignForm: CampaignFormData
  filters: {
    search: string
    status: string[]
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
  loading: boolean
  error: string | null
  sending: boolean
}

export const useCampaignsStore = defineStore('campaigns', {
  state: (): CampaignsState => ({
    campaigns: [],
    templates: [],
    currentCampaign: null,
    campaignForm: {
      name: '',
      subject: '',
      html_content: '',
      text_content: '',
      from_name: 'Mailer Be-Mindpower',
      from_email: 'noreply@yourdomain.com',
      recipients: {
        type: 'all'
      }
    },
    filters: {
      search: '',
      status: []
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0
    },
    loading: false,
    error: null,
    sending: false
  }),

  getters: {
    filteredCampaigns: (state) => {
      let filtered = [...state.campaigns]

      // Filtrar por búsqueda
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(campaign => 
          campaign.name.toLowerCase().includes(search) ||
          campaign.subject.toLowerCase().includes(search)
        )
      }

      // Filtrar por estado
      if (state.filters.status.length > 0) {
        filtered = filtered.filter(campaign => 
          state.filters.status.includes(campaign.status)
        )
      }

      return filtered
    },

    campaignsByStatus: (state) => {
      const statusCounts = {
        draft: 0,
        scheduled: 0,
        sending: 0,
        sent: 0,
        paused: 0,
        cancelled: 0
      }

      state.campaigns.forEach(campaign => {
        statusCounts[campaign.status]++
      })

      return statusCounts
    },

    totalPages: (state) => {
      return Math.ceil(state.pagination.total / state.pagination.limit)
    },

    isFormValid: (state) => {
      return !!(
        state.campaignForm.name &&
        state.campaignForm.subject &&
        state.campaignForm.html_content &&
        state.campaignForm.from_name &&
        state.campaignForm.from_email
      )
    }
  },

  actions: {
    async fetchCampaigns(page?: number) {
      if (page) {
        this.pagination.page = page
      }

      this.loading = true
      this.error = null

      try {
        const { campaigns, fetchCampaigns } = useCampaigns()
        
        await fetchCampaigns(this.pagination.page, this.pagination.limit)
        this.campaigns = campaigns.value
      } catch (error: any) {
        this.error = error.message || 'Error al cargar campañas'
      } finally {
        this.loading = false
      }
    },

    async fetchTemplates() {
      try {
        const { templates, fetchTemplates } = useTemplates()
        await fetchTemplates()
        this.templates = templates.value
      } catch (error: any) {
        console.error('Error fetching templates:', error)
      }
    },

    async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const { createCampaign } = useCampaigns()
        const newCampaign = await createCampaign(campaignData)

        if (newCampaign) {
          this.campaigns.unshift(newCampaign)
          this.pagination.total++
        }

        return newCampaign
      } catch (error: any) {
        this.error = error.message || 'Error al crear campaña'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateCampaign(id: string, updates: Partial<EmailCampaign>) {
      this.loading = true
      this.error = null

      try {
        const { updateCampaign } = useCampaigns()
        const updatedCampaign = await updateCampaign(id, updates)

        if (updatedCampaign) {
          const index = this.campaigns.findIndex(c => c.id === id)
          if (index !== -1) {
            this.campaigns[index] = updatedCampaign
          }

          if (this.currentCampaign?.id === id) {
            this.currentCampaign = updatedCampaign
          }
        }

        return updatedCampaign
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar campaña'
        return null
      } finally {
        this.loading = false
      }
    },

    async sendCampaign(campaignId: string) {
      this.sending = true
      this.error = null

      try {
        // Llamar a la API para enviar la campaña
        const response = await $fetch(`/api/campaigns/${campaignId}/send`, {
          method: 'POST'
        })

        if (response.success) {
          // Actualizar el estado de la campaña
          await this.updateCampaign(campaignId, { 
            status: 'sending',
            sent_at: new Date().toISOString()
          })
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Error al enviar campaña'
        return { success: false, error: this.error }
      } finally {
        this.sending = false
      }
    },

    async pauseCampaign(campaignId: string) {
      try {
        const response = await $fetch(`/api/campaigns/${campaignId}/pause`, {
          method: 'POST'
        })

        if (response.success) {
          await this.updateCampaign(campaignId, { status: 'paused' })
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Error al pausar campaña'
        return { success: false, error: this.error }
      }
    },

    async resumeCampaign(campaignId: string) {
      try {
        const response = await $fetch(`/api/campaigns/${campaignId}/resume`, {
          method: 'POST'
        })

        if (response.success) {
          await this.updateCampaign(campaignId, { status: 'sending' })
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Error al reanudar campaña'
        return { success: false, error: this.error }
      }
    },

    async cancelCampaign(campaignId: string) {
      try {
        const response = await $fetch(`/api/campaigns/${campaignId}/cancel`, {
          method: 'POST'
        })

        if (response.success) {
          await this.updateCampaign(campaignId, { status: 'cancelled' })
        }

        return response
      } catch (error: any) {
        this.error = error.message || 'Error al cancelar campaña'
        return { success: false, error: this.error }
      }
    },

    async duplicateCampaign(campaignId: string) {
      this.loading = true
      this.error = null

      try {
        const originalCampaign = this.campaigns.find(c => c.id === campaignId)
        if (!originalCampaign) {
          throw new Error('Campaña no encontrada')
        }

        const duplicatedData = {
          ...originalCampaign,
          name: `${originalCampaign.name} (Copia)`,
          status: 'draft' as const,
          sent_at: null,
          total_recipients: 0,
          sent_count: 0,
          delivered_count: 0,
          opened_count: 0,
          clicked_count: 0,
          bounced_count: 0,
          unsubscribed_count: 0
        }

        delete (duplicatedData as any).id
        delete (duplicatedData as any).created_at
        delete (duplicatedData as any).updated_at

        return await this.createCampaign(duplicatedData)
      } catch (error: any) {
        this.error = error.message || 'Error al duplicar campaña'
        return null
      } finally {
        this.loading = false
      }
    },

    // Gestión del formulario de campaña
    updateCampaignForm(updates: Partial<CampaignFormData>) {
      this.campaignForm = { ...this.campaignForm, ...updates }
    },

    resetCampaignForm() {
      this.campaignForm = {
        name: '',
        subject: '',
        html_content: '',
        text_content: '',
        from_name: 'Mailer Be-Mindpower',
        from_email: 'noreply@yourdomain.com',
        recipients: {
          type: 'all'
        }
      }
    },

    loadCampaignToForm(campaign: EmailCampaign) {
      this.campaignForm = {
        name: campaign.name,
        subject: campaign.subject,
        template_id: campaign.template_id || undefined,
        html_content: campaign.html_content,
        text_content: campaign.text_content || '',
        from_name: campaign.from_name,
        from_email: campaign.from_email,
        reply_to: campaign.reply_to || undefined,
        scheduled_at: campaign.scheduled_at || undefined,
        recipients: {
          type: 'all' // Por defecto, se puede mejorar con lógica específica
        }
      }
    },

    async saveCampaignFromForm() {
      if (!this.isFormValid) {
        this.error = 'Por favor completa todos los campos requeridos'
        return null
      }

      const campaignData = {
        name: this.campaignForm.name,
        subject: this.campaignForm.subject,
        template_id: this.campaignForm.template_id,
        html_content: this.campaignForm.html_content,
        text_content: this.campaignForm.text_content,
        from_name: this.campaignForm.from_name,
        from_email: this.campaignForm.from_email,
        reply_to: this.campaignForm.reply_to,
        scheduled_at: this.campaignForm.scheduled_at,
        status: 'draft' as const,
        total_recipients: 0,
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0,
        bounced_count: 0,
        unsubscribed_count: 0
      }

      return await this.createCampaign(campaignData)
    },

    // Gestión de filtros
    setSearchFilter(search: string) {
      this.filters.search = search
      this.pagination.page = 1
    },

    setStatusFilter(status: string[]) {
      this.filters.status = status
      this.pagination.page = 1
    },

    clearFilters() {
      this.filters = {
        search: '',
        status: []
      }
      this.pagination.page = 1
    },

    // Paginación
    setPage(page: number) {
      this.pagination.page = page
    },

    setLimit(limit: number) {
      this.pagination.limit = limit
      this.pagination.page = 1
    },

    nextPage() {
      if (this.pagination.page < this.totalPages) {
        this.pagination.page++
      }
    },

    prevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--
      }
    },

    // Gestión de campaña actual
    setCurrentCampaign(campaign: EmailCampaign | null) {
      this.currentCampaign = campaign
    },

    async fetchCampaignById(id: string) {
      this.loading = true
      this.error = null

      try {
        const { supabase } = useSupabase()
        const { data, error } = await supabase
          .from('email_campaigns')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          this.error = error.message
          return null
        }

        this.currentCampaign = data
        return data
      } catch (error: any) {
        this.error = error.message || 'Error al cargar campaña'
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
