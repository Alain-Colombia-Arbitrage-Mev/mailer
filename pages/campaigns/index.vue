<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 lg:py-6 space-y-4 lg:space-y-0">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              Campañas de Email
              <span class="ml-2 text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {{ campaigns.length }} campañas
              </span>
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Gestiona y envía campañas masivas de email marketing
            </p>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <NuxtLink
              to="/campaigns/new"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nueva Campaña
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Filtros -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Búsqueda -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nombre de campaña..."
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="scheduled">Programada</option>
              <option value="sending">Enviando</option>
              <option value="sent">Enviada</option>
              <option value="paused">Pausada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <!-- Plantilla -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Plantilla</label>
            <select
              v-model="selectedTemplate"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas las plantillas</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
          </div>

          <!-- Ordenar -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Ordenar por</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="created_at">Fecha de creación</option>
              <option value="name">Nombre</option>
              <option value="status">Estado</option>
              <option value="sent_at">Fecha de envío</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Lista de Campañas -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>

        <div v-else-if="filteredCampaigns.length === 0" class="text-center py-12">
          <EnvelopeIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay campañas</h3>
          <p class="text-gray-500 mb-4">Comienza creando tu primera campaña de email marketing</p>
          <NuxtLink
            to="/campaigns/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Crear Primera Campaña
          </NuxtLink>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="campaign in filteredCampaigns"
            :key="campaign.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ campaign.name }}</h3>
                  <span
                    :class="getStatusClass(campaign.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStatusLabel(campaign.status) }}
                  </span>
                </div>
                
                <div class="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span class="font-medium">Contactos:</span> {{ campaign.total_contacts?.toLocaleString() || 0 }}
                  </div>
                  <div>
                    <span class="font-medium">Enviados:</span> {{ campaign.sent_count?.toLocaleString() || 0 }}
                  </div>
                  <div>
                    <span class="font-medium">Entregados:</span> {{ campaign.delivered_count?.toLocaleString() || 0 }}
                  </div>
                  <div>
                    <span class="font-medium">Abiertos:</span> {{ campaign.opened_count?.toLocaleString() || 0 }}
                  </div>
                </div>

                <div class="mt-2 text-sm text-gray-500">
                  <span v-if="campaign.created_at">
                    Creada: {{ formatDate(campaign.created_at) }}
                  </span>
                  <span v-if="campaign.sent_at" class="ml-4">
                    Enviada: {{ formatDate(campaign.sent_at) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="viewCampaign(campaign)"
                  class="text-purple-600 hover:text-purple-900"
                  title="Ver campaña"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button
                  @click="editCampaign(campaign)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Editar campaña"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  v-if="campaign.status === 'draft'"
                  @click="sendCampaign(campaign)"
                  class="text-green-600 hover:text-green-900"
                  title="Enviar campaña"
                >
                  <PaperAirplaneIcon class="h-5 w-5" />
                </button>
                <button
                  @click="deleteCampaign(campaign)"
                  class="text-red-600 hover:text-red-900"
                  title="Eliminar campaña"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  PaperAirplaneIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const { supabase } = useSupabaseMaster()

// Estado
const campaigns = ref([])
const templates = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedTemplate = ref('all')
const sortBy = ref('created_at')

// Computed
const filteredCampaigns = computed(() => {
  let filtered = [...campaigns.value]

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign =>
      campaign.name.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(campaign => campaign.status === selectedStatus.value)
  }

  // Filtrar por plantilla
  if (selectedTemplate.value !== 'all') {
    filtered = filtered.filter(campaign => campaign.template_id === selectedTemplate.value)
  }

  // Ordenar
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      case 'sent_at':
        aValue = new Date(a.sent_at || '1970-01-01')
        bValue = new Date(b.sent_at || '1970-01-01')
        break
      default:
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
    }

    return bValue > aValue ? 1 : -1 // Orden descendente
  })

  return filtered
})

// Métodos
const loadCampaigns = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    campaigns.value = data || []
  } catch (error) {
    console.error('Error cargando campañas:', error)
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('id, name')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    templates.value = data || []
  } catch (error) {
    console.error('Error cargando plantillas:', error)
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    sending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-green-100 text-green-800',
    paused: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels = {
    draft: 'Borrador',
    scheduled: 'Programada',
    sending: 'Enviando',
    sent: 'Enviada',
    paused: 'Pausada',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewCampaign = (campaign: any) => {
  navigateTo(`/campaigns/${campaign.id}`)
}

const editCampaign = (campaign: any) => {
  navigateTo(`/campaigns/new?id=${campaign.id}`)
}

const sendCampaign = async (campaign: any) => {
  if (!confirm(`¿Enviar la campaña "${campaign.name}" a ${campaign.total_contacts} contactos?`)) return
  
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'sending' })
      .eq('id', campaign.id)

    if (error) throw error
    
    // Aquí iría la lógica para enviar la campaña
    alert('Campaña enviada exitosamente')
    await loadCampaigns()
  } catch (error) {
    console.error('Error enviando campaña:', error)
    alert('Error al enviar la campaña')
  }
}

const deleteCampaign = async (campaign: any) => {
  if (!confirm(`¿Eliminar la campaña "${campaign.name}"?`)) return
  
  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaign.id)

    if (error) throw error
    
    campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
  } catch (error) {
    console.error('Error eliminando campaña:', error)
    alert('Error al eliminar la campaña')
  }
}

// Inicialización
onMounted(async () => {
  await Promise.all([
    loadCampaigns(),
    loadTemplates()
  ])
})
</script>
