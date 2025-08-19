<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4 lg:py-6">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Configuración</h1>
          <p class="mt-1 text-sm text-gray-500">
            Gestiona la configuración de tu cuenta y aplicación
          </p>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div class="text-center py-12">
          <CogIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Configuración</h3>
          <p class="text-gray-500">Esta página está en desarrollo</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CogIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})
</script>
