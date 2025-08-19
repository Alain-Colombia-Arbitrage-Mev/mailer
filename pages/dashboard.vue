<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500">
        Resumen general de tu actividad de email marketing
      </p>
    </div>

    <!-- Stats overview -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="stat-card">
        <div class="stat-card-content">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="stat-card-icon bg-blue-500">
                <EnvelopeIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Emails Enviados
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatNumber(stats.totalEmailsSent) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpIcon class="self-center flex-shrink-0 h-4 w-4" />
                    <span class="sr-only">Incremento de</span>
                    12%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-content">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="stat-card-icon bg-green-500">
                <EyeIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Tasa de Apertura
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.averageOpenRate.toFixed(1) }}%
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpIcon class="self-center flex-shrink-0 h-4 w-4" />
                    2.1%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-content">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="stat-card-icon bg-yellow-500">
                <CursorArrowRaysIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Tasa de Clics
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.averageClickRate.toFixed(1) }}%
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    <ArrowDownIcon class="self-center flex-shrink-0 h-4 w-4" />
                    0.3%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-content">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="stat-card-icon bg-purple-500">
                <UsersIcon class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Contactos Activos
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatNumber(stats.totalContacts) }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpIcon class="self-center flex-shrink-0 h-4 w-4" />
                    8%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Email performance chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">
            Rendimiento de Emails (Últimos 30 días)
          </h3>
        </div>
        <div class="card-body">
          <div class="h-64 flex items-center justify-center text-gray-500">
            <!-- Chart component would go here -->
            <div class="text-center">
              <ChartBarIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Gráfico de rendimiento</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent campaigns -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">
            Campañas Recientes
          </h3>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div
              v-for="campaign in recentCampaigns"
              :key="campaign.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ campaign.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(campaign.sent_at) }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="badge"
                  :class="`status-${campaign.status}`"
                >
                  {{ getStatusLabel(campaign.status) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ campaign.sent_count }} enviados
                </span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink
              to="/campaigns"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Ver todas las campañas →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">
          Acciones Rápidas
        </h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            to="/emails/compose"
            class="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <PaperAirplaneIcon class="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p class="font-medium text-emerald-900">Componer Email</p>
              <p class="text-sm text-emerald-600">Email personal con adjuntos</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/campaigns/new"
            class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <EnvelopeIcon class="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p class="font-medium text-blue-900">Nueva Campaña</p>
              <p class="text-sm text-blue-600">Envío masivo de emails</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/contacts"
            class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <UsersIcon class="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p class="font-medium text-green-900">Gestionar Usuarios</p>
              <p class="text-sm text-green-600">Base de datos de usuarios registrados</p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/templates"
            class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <DocumentTextIcon class="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p class="font-medium text-purple-900">Plantillas HTML</p>
              <p class="text-sm text-purple-600">Gestionar plantillas de email</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  EnvelopeIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

// Mock data - in real app this would come from API
const stats = ref({
  totalEmailsSent: 12543,
  totalContacts: 3421,
  averageOpenRate: 24.3,
  averageClickRate: 3.7
})

const recentCampaigns = ref([
  {
    id: '1',
    name: 'Newsletter Marzo 2024',
    status: 'sent',
    sent_count: 1234,
    sent_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Promoción Especial',
    status: 'sending',
    sent_count: 856,
    sent_at: '2024-03-14T14:30:00Z'
  },
  {
    id: '3',
    name: 'Bienvenida Nuevos Usuarios',
    status: 'sent',
    sent_count: 432,
    sent_at: '2024-03-13T09:15:00Z'
  }
])

// Methods
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    scheduled: 'Programada',
    sending: 'Enviando',
    sent: 'Enviada',
    paused: 'Pausada',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}

// Load data on mount
onMounted(async () => {
  try {
    // In real app, load data from analytics store
    // const analyticsStore = useAnalyticsStore()
    // await analyticsStore.fetchOverviewMetrics()
    // stats.value = analyticsStore.metrics
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})

// Metadata
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Dashboard - Mailer Be-Mindpower',
  description: 'Panel de control para gestionar tus campañas de email marketing'
})
</script>
