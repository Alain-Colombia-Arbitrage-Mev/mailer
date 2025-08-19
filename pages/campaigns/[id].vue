<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4 lg:py-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-3">
                <NuxtLink
                  to="/campaigns"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeftIcon class="h-5 w-5" />
                </NuxtLink>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
                  {{ campaign?.name || 'Cargando...' }}
                </h1>
                <span
                  v-if="campaign"
                  :class="getStatusClass(campaign.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(campaign.status) }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Detalles y estadísticas de la campaña
              </p>
            </div>
            
            <div v-if="campaign" class="flex space-x-3">
              <NuxtLink
                :to="`/campaigns/new?id=${campaign.id}`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon class="h-4 w-4 mr-2" />
                Editar
              </NuxtLink>
              
              <button
                v-if="campaign.status === 'draft'"
                @click="sendCampaign"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PaperAirplaneIcon class="h-4 w-4 mr-2" />
                Enviar Campaña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>

      <div v-else-if="!campaign" class="text-center py-12">
        <ExclamationTriangleIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Campaña no encontrada</h3>
        <p class="text-gray-500 mb-4">La campaña que buscas no existe o fue eliminada</p>
        <NuxtLink
          to="/campaigns"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          Volver a Campañas
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-xl border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-8 w-8 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Contactos</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ campaign.total_contacts?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <PaperAirplaneIcon class="h-8 w-8 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Enviados</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ campaign.sent_count?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-8 w-8 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Entregados</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ campaign.delivered_count?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <EyeIcon class="h-8 w-8 text-orange-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Abiertos</p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ campaign.opened_count?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Información de la campaña -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Campaña</h3>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha de Creación</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(campaign.created_at) }}
              </dd>
            </div>
            <div v-if="campaign.sent_at">
              <dt class="text-sm font-medium text-gray-500">Fecha de Envío</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(campaign.sent_at) }}
              </dd>
            </div>
            <div v-if="campaign.scheduled_at">
              <dt class="text-sm font-medium text-gray-500">Programada para</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(campaign.scheduled_at) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Estado</dt>
              <dd class="mt-1">
                <span
                  :class="getStatusClass(campaign.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(campaign.status) }}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Placeholder para más contenido -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Análisis Detallado</h3>
          <div class="text-center py-8">
            <ChartBarIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-500">Análisis detallado en desarrollo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  PencilIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CheckCircleIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

// Meta
definePageMeta({
  middleware: 'auth'
})

// Composables
const route = useRoute()
const { supabase } = useSupabaseMaster()

// Estado
const campaign = ref(null)
const loading = ref(true)

// Computed
const campaignId = computed(() => route.params.id as string)

// Métodos
const loadCampaign = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId.value)
      .single()

    if (error) throw error
    campaign.value = data
  } catch (error) {
    console.error('Error cargando campaña:', error)
    campaign.value = null
  } finally {
    loading.value = false
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const sendCampaign = async () => {
  if (!confirm(`¿Enviar la campaña "${campaign.value.name}"?`)) return
  
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ status: 'sending' })
      .eq('id', campaignId.value)

    if (error) throw error
    
    campaign.value.status = 'sending'
    alert('Campaña enviada exitosamente')
  } catch (error) {
    console.error('Error enviando campaña:', error)
    alert('Error al enviar la campaña')
  }
}

// Inicialización
onMounted(() => {
  loadCampaign()
})
</script>
