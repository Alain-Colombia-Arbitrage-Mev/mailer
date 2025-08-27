<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <!-- Page Header -->
      <div class="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-200 mb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 lg:py-8 space-y-4 lg:space-y-0">
            <div>
              <div class="flex items-center space-x-3">
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl shadow-md">
                  <EnvelopeIcon class="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Campañas de Email
                  </h1>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full shadow-sm">
                      {{ campaigns.length }} campañas activas
                    </span>
                    <span class="text-sm text-gray-500">•</span>
                    <span class="text-sm text-gray-600">Marketing profesional</span>
                  </div>
                </div>
              </div>
              <p class="mt-2 text-gray-600 max-w-2xl">
                Gestiona y envía campañas masivas de email marketing con análisis detallados y segmentación avanzada
              </p>
            </div>
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <NuxtLink
                to="/campaigns/new"
                class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <PlusIcon class="h-5 w-5 mr-2" />
                Nueva Campaña
              </NuxtLink>
              <button
                @click="loadCampaigns"
                class="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg hover:border-purple-300 transition-all duration-200"
              >
                <ArrowPathIcon class="h-5 w-5 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Advanced Filters -->
        <div class="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-purple-200 p-6 mb-8">
          <div class="flex items-center mb-4">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-md mr-3">
              <AdjustmentsHorizontalIcon class="h-5 w-5 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Filtros y Búsqueda</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Campaña</label>
              <div class="relative">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Nombre de campaña..."
                  class="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                v-model="selectedStatus"
                class="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              >
                <option value="all">🏷️ Todos los estados</option>
                <option value="draft">📝 Borrador</option>
                <option value="scheduled">⏰ Programada</option>
                <option value="sending">📤 Enviando</option>
                <option value="sent">✅ Enviada</option>
                <option value="paused">⏸️ Pausada</option>
                <option value="cancelled">❌ Cancelada</option>
              </select>
            </div>

            <!-- Template -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Plantilla</label>
              <select
                v-model="selectedTemplate"
                class="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              >
                <option value="all">📄 Todas las plantillas</option>
                <option v-for="template in templates" :key="template.id" :value="template.id">
                  {{ template.name }}
                </option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                v-model="sortBy"
                class="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              >
                <option value="created_at">📅 Fecha de creación</option>
                <option value="name">📝 Nombre</option>
                <option value="status">🏷️ Estado</option>
                <option value="sent_at">📤 Fecha de envío</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Campaigns List -->
        <div class="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-purple-200 overflow-hidden">
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-16">
            <div class="relative">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <EnvelopeIcon class="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p class="mt-4 text-gray-600 font-medium">Cargando campañas...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredCampaigns.length === 0" class="text-center py-16">
            <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon class="h-10 w-10 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">No hay campañas disponibles</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              Comienza a hacer crecer tu negocio creando tu primera campaña de email marketing profesional
            </p>
            <NuxtLink
              to="/campaigns/new"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Crear Primera Campaña
            </NuxtLink>
          </div>

          <!-- Campaigns List -->
          <div v-else>
            <div
              v-for="(campaign, index) in filteredCampaigns"
              :key="campaign.id"
              class="group relative"
              :class="{ 'border-b border-gray-200': index < filteredCampaigns.length - 1 }"
            >
              <div class="p-6 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-200">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <!-- Campaign Info -->
                  <div class="flex-1">
                    <div class="flex items-start space-x-4">
                      <!-- Status Icon -->
                      <div :class="getStatusIconClass(campaign.status)" class="p-2 rounded-xl shadow-md">
                        <component :is="getStatusIcon(campaign.status)" class="h-5 w-5 text-white" />
                      </div>
                      
                      <div class="flex-1">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                          <h3 class="text-lg font-semibold text-gray-800">{{ campaign.name }}</h3>
                          <span
                            :class="getStatusClass(campaign.status)"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm w-fit"
                          >
                            {{ getStatusLabel(campaign.status) }}
                          </span>
                        </div>
                        
                        <!-- Stats Grid -->
                        <div class="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div class="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <div class="text-xs font-medium text-gray-600 mb-1">👥 Contactos</div>
                            <div class="text-sm font-semibold text-gray-800">{{ campaign.total_contacts?.toLocaleString() || 0 }}</div>
                          </div>
                          <div class="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <div class="text-xs font-medium text-gray-600 mb-1">📤 Enviados</div>
                            <div class="text-sm font-semibold text-blue-600">{{ campaign.sent_count?.toLocaleString() || 0 }}</div>
                          </div>
                          <div class="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <div class="text-xs font-medium text-gray-600 mb-1">✅ Entregados</div>
                            <div class="text-sm font-semibold text-green-600">{{ campaign.delivered_count?.toLocaleString() || 0 }}</div>
                          </div>
                          <div class="bg-white/60 rounded-lg p-3 border border-gray-200">
                            <div class="text-xs font-medium text-gray-600 mb-1">👀 Abiertos</div>
                            <div class="text-sm font-semibold text-purple-600">{{ campaign.opened_count?.toLocaleString() || 0 }}</div>
                          </div>
                        </div>

                        <!-- Dates -->
                        <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span v-if="campaign.created_at" class="flex items-center">
                            <CalendarIcon class="h-4 w-4 mr-1" />
                            Creada: {{ formatDate(campaign.created_at) }}
                          </span>
                          <span v-if="campaign.sent_at" class="flex items-center">
                            <PaperAirplaneIcon class="h-4 w-4 mr-1" />
                            Enviada: {{ formatDate(campaign.sent_at) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-3">
                    <div class="bg-white rounded-xl p-2 shadow-md border border-gray-200 flex space-x-2">
                      <button
                        @click="viewCampaign(campaign)"
                        class="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        title="Ver detalles"
                      >
                        <EyeIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="editCampaign(campaign)"
                        class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Editar campaña"
                      >
                        <PencilIcon class="h-5 w-5" />
                      </button>
                      <button
                        v-if="campaign.status === 'draft'"
                        @click="sendCampaign(campaign)"
                        class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Enviar campaña"
                      >
                        <PaperAirplaneIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="deleteCampaign(campaign)"
                        class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
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
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  PaperAirplaneIcon,
  TrashIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayCircleIcon,
  PauseCircleIcon
} from '@heroicons/vue/24/outline'

// Define page meta with middleware
definePageMeta({
  middleware: 'auth'
})

// State
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

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(campaign =>
      campaign.name.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(campaign => campaign.status === selectedStatus.value)
  }

  // Filter by template
  if (selectedTemplate.value !== 'all') {
    filtered = filtered.filter(campaign => campaign.template_id === selectedTemplate.value)
  }

  // Sort
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
        aValue = new Date(a.created_at || '1970-01-01')
        bValue = new Date(b.created_at || '1970-01-01')
    }

    return bValue > aValue ? 1 : -1 // Descending order
  })

  return filtered
})

// Methods
const loadCampaigns = async () => {
  loading.value = true
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    campaigns.value = data || []
  } catch (error) {
    console.error('Error loading campaigns:', error)
  } finally {
    loading.value = false
  }
}

const loadTemplates = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('email_templates')
      .select('id, name')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    templates.value = data || []
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const getStatusClass = (status) => {
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

const getStatusLabel = (status) => {
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

const getStatusIcon = (status) => {
  const icons = {
    draft: DocumentTextIcon,
    scheduled: ClockIcon,
    sending: ArrowPathIcon,
    sent: CheckCircleIcon,
    paused: PauseCircleIcon,
    cancelled: XCircleIcon
  }
  return icons[status] || DocumentTextIcon
}

const getStatusIconClass = (status) => {
  const classes = {
    draft: 'bg-gradient-to-r from-gray-500 to-gray-600',
    scheduled: 'bg-gradient-to-r from-blue-500 to-blue-600',
    sending: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    sent: 'bg-gradient-to-r from-green-500 to-green-600',
    paused: 'bg-gradient-to-r from-orange-500 to-red-500',
    cancelled: 'bg-gradient-to-r from-red-500 to-red-600'
  }
  return classes[status] || 'bg-gradient-to-r from-gray-500 to-gray-600'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewCampaign = (campaign) => {
  return navigateTo(`/campaigns/${campaign.id}`)
}

const editCampaign = (campaign) => {
  return navigateTo(`/campaigns/new?id=${campaign.id}`)
}

const sendCampaign = async (campaign) => {
  if (!confirm(`¿Enviar la campaña "${campaign.name}" a ${campaign.total_contacts} contactos?`)) return
  
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'sending' })
      .eq('id', campaign.id)

    if (error) throw error
    
    // Here would go the logic to send the campaign
    alert('Campaña enviada exitosamente')
    await loadCampaigns()
  } catch (error) {
    console.error('Error sending campaign:', error)
    alert('Error al enviar la campaña')
  }
}

const deleteCampaign = async (campaign) => {
  if (!confirm(`¿Eliminar la campaña "${campaign.name}"?`)) return
  
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaign.id)

    if (error) throw error
    
    campaigns.value = campaigns.value.filter(c => c.id !== campaign.id)
  } catch (error) {
    console.error('Error deleting campaign:', error)
    alert('Error al eliminar la campaña')
  }
}

// Initialize
onMounted(async () => {
  await Promise.all([
    loadCampaigns(),
    loadTemplates()
  ])
})

// Set page title
useHead({
  title: 'Campañas - MailPower'
})
</script>
