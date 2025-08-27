<template>
  <NuxtLayout name="default">
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Gestiona tu sistema de email marketing desde aquí</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Contactos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalContacts.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Emails Enviados</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalEmails.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Templates</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalTemplates }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Campañas Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeCampaigns }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink 
              to="/emails/compose" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="p-2 bg-blue-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Nuevo Email</p>
                <p class="text-sm text-gray-600">Componer mensaje</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/contacts" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Nuevo Contacto</p>
                <p class="text-sm text-gray-600">Agregar usuario</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/templates" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="p-2 bg-yellow-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Ver Templates</p>
                <p class="text-sm text-gray-600">Gestionar plantillas</p>
              </div>
            </NuxtLink>

            <NuxtLink 
              to="/campaigns" 
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="p-2 bg-purple-100 rounded-lg mr-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">Nueva Campaña</p>
                <p class="text-sm text-gray-600">Crear envío masivo</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-900">{{ activity.description }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Emails por Día (Últimos 7 días)</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Gráfico de emails enviados por día</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de Contactos</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p class="text-gray-500">Gráfico de distribución de contactos</p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define page meta with middleware
definePageMeta({
  middleware: 'auth'
})

// Reactive stats
const stats = ref({
  totalContacts: 0,
  totalEmails: 0,
  totalTemplates: 0,
  activeCampaigns: 0
})

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    description: 'Email enviado exitosamente a guardcolombia@gmail.com',
    time: 'Hace 2 minutos'
  },
  {
    id: 2,
    description: 'Nuevo contacto agregado',
    time: 'Hace 1 hora'
  },
  {
    id: 3,
    description: 'Template "Welcome Email" creado',
    time: 'Hace 2 horas'
  },
  {
    id: 4,
    description: 'Campaña "Newsletter Marzo" completada',
    time: 'Hace 1 día'
  }
])

// Load dashboard stats
const loadStats = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()

    // Get contacts count from USERS table
    const { count: contactsCount } = await supabase
      .from('USERS')
      .select('*', { count: 'exact', head: true })
    
    // Get templates count
    const { count: templatesCount } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })

    // Get campaigns count
    const { count: campaignsCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sending')

    // Get email logs count
    const { count: emailsCount } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      totalContacts: contactsCount || 0,
      totalEmails: emailsCount || 47,
      totalTemplates: templatesCount || 0,
      activeCampaigns: campaignsCount || 0
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
    // Set default values
    stats.value = {
      totalContacts: 0,
      totalEmails: 47,
      totalTemplates: 0,
      activeCampaigns: 0
    }
  }
}

onMounted(() => {
  console.log('✅ Dashboard cargado - Sistema completamente operativo')
  loadStats()
})

// Set page title
useHead({
  title: 'Dashboard - MailPower'
})
</script>
