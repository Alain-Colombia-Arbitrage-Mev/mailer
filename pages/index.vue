<template>
  <NuxtLayout name="default">
    <div>
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a MailPower
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Tu plataforma completa de email marketing. Gestiona contactos, crea plantillas profesionales 
          y envía campañas efectivas que lleguen a tu audiencia.
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <NuxtLink 
          to="/emails/compose"
          class="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-blue-300"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Componer Email</h3>
          <p class="text-gray-600 text-sm">Crea y envía emails personalizados a tus contactos de forma rápida y sencilla.</p>
          <div class="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Crear nuevo email →
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/contacts"
          class="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-green-300"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Gestionar Contactos</h3>
          <p class="text-gray-600 text-sm">Organiza tu base de datos de contactos y segmenta tu audiencia eficientemente.</p>
          <div class="mt-4 text-green-600 text-sm font-medium group-hover:text-green-700">
            Ver contactos →
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/templates"
          class="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-yellow-300"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Plantillas</h3>
          <p class="text-gray-600 text-sm">Crea plantillas reutilizables para ahorrar tiempo en tus campañas de email.</p>
          <div class="mt-4 text-yellow-600 text-sm font-medium group-hover:text-yellow-700">
            Ver plantillas →
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/campaigns"
          class="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-purple-300"
        >
          <div class="flex items-center mb-4">
            <div class="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Campañas</h3>
          <p class="text-gray-600 text-sm">Lanza campañas masivas y rastrea su rendimiento en tiempo real.</p>
          <div class="mt-4 text-purple-600 text-sm font-medium group-hover:text-purple-700">
            Crear campaña →
          </div>
        </NuxtLink>
      </div>

      <!-- Stats Overview -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Resumen de Actividad</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ stats.totalEmails }}</div>
            <div class="text-gray-600">Emails Enviados</div>
            <div class="text-sm text-gray-500 mt-1">Este mes</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ stats.totalContacts }}</div>
            <div class="text-gray-600">Contactos Activos</div>
            <div class="text-sm text-gray-500 mt-1">En tu base de datos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ stats.openRate }}%</div>
            <div class="text-gray-600">Tasa de Apertura</div>
            <div class="text-sm text-gray-500 mt-1">Promedio mensual</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
          <NuxtLink 
            to="/dashboard"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver dashboard completo →
          </NuxtLink>
        </div>
        
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium text-gray-900">{{ activity.title }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ activity.description }}</div>
              <div class="text-xs text-gray-500 mt-2">{{ activity.time }}</div>
            </div>
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

// Reactive data
const stats = ref({
  totalEmails: 0,
  totalContacts: 0,
  openRate: 0
})

const recentActivity = ref([
  {
    id: 1,
    title: 'Email enviado exitosamente',
    description: 'Mensaje enviado a guardcolombia@gmail.com',
    time: 'Hace 5 minutos'
  },
  {
    id: 2,
    title: 'Nuevo contacto agregado',
    description: 'Se agregó un nuevo contacto a la base de datos',
    time: 'Hace 1 hora'
  },
  {
    id: 3,
    title: 'Plantilla creada',
    description: 'Nueva plantilla "Newsletter Bienvenida" disponible',
    time: 'Hace 2 horas'
  }
])

// Load stats
const loadStats = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()

    // Get contacts count
    const { count: contactsCount } = await supabase
      .from('USERS')
      .select('*', { count: 'exact', head: true })

    // Get templates count (as a proxy for emails sent)
    const { count: templatesCount } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true })

    stats.value = {
      totalEmails: templatesCount * 15 || 47, // Mock calculation
      totalContacts: contactsCount || 0,
      openRate: 68.5 // Mock value
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    // Set default values
    stats.value = {
      totalEmails: 47,
      totalContacts: 156,
      openRate: 68.5
    }
  }
}

onMounted(() => {
  console.log('🏠 Página de inicio cargada - Sistema MailPower operativo')
  loadStats()
})

// Set page title
useHead({
  title: 'Inicio - MailPower'
})
</script>
