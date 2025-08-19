<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-8">
          <EnvelopeIcon class="h-8 w-8 text-blue-600" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">Mailer</span>
          <span class="block text-blue-600">Be-Mindpower</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Sistema empresarial completo de email marketing con Magic Link authentication y tracking avanzado.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <NuxtLink
              to="/auth/login"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              <ShieldCheckIcon class="h-5 w-5 mr-2" />
              Acceso con Magic Link
            </NuxtLink>
          </div>
        </div>
        <p class="mt-3 text-sm text-gray-500">
          Acceso seguro sin contraseñas • Solo necesitas tu email
        </p>
      </div>

      <!-- Features Grid -->
      <div class="mt-20">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm hover:shadow-md transition-shadow">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <PaperAirplaneIcon class="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Envío Masivo con Amazon SES
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Envía miles de emails personalizados con rate limiting automático y tracking completo de aperturas y clics.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm hover:shadow-md transition-shadow">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                    <UsersIcon class="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Gestión Inteligente de Contactos
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Organiza con tags, importa CSV masivo, segmentación automática y validación de emails en tiempo real.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm hover:shadow-md transition-shadow">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                    <ChartBarIcon class="h-6 w-6 text-white" />
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Analytics en Tiempo Real
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Métricas instantáneas, geolocalización por IP, análisis de dispositivos y reportes exportables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900">
              ¿Listo para comenzar?
            </h2>
            <p class="mt-4 text-lg text-gray-600">
              Accede de forma segura con Magic Link - sin contraseñas, sin complicaciones.
            </p>
            <div class="mt-8">
              <NuxtLink
                to="/auth/login"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <EnvelopeIcon class="mr-2 h-5 w-5" />
                Acceder con Magic Link
              </NuxtLink>
            </div>
            <div class="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div class="flex items-center">
                <CheckCircleIcon class="h-4 w-4 text-green-500 mr-1" />
                Sin contraseñas
              </div>
              <div class="flex items-center">
                <CheckCircleIcon class="h-4 w-4 text-green-500 mr-1" />
                Acceso instantáneo
              </div>
              <div class="flex items-center">
                <CheckCircleIcon class="h-4 w-4 text-green-500 mr-1" />
                100% seguro
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
  EnvelopeIcon,
  UsersIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Composables
const user = useSupabaseUser()

// Redirect to dashboard if user is already authenticated
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

// Metadata
definePageMeta({
  layout: false,
  middleware: 'guest'
})

useSeoMeta({
  title: 'Mailer Be-Mindpower - Email Marketing con Magic Link',
  description: 'Sistema empresarial de email marketing con autenticación Magic Link, tracking avanzado y envío masivo con Amazon SES.'
})
</script>
