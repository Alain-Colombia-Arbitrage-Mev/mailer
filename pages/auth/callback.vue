<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="spinner-lg mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">
        Procesando autenticación...
      </h2>
      <p class="text-gray-600">
        Por favor espera mientras confirmamos tu sesión.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

// This page handles the auth callback from Supabase
// The @nuxtjs/supabase module will automatically handle the callback
// and redirect to the appropriate page

onMounted(() => {
  // Add a timeout to redirect if something goes wrong
  setTimeout(() => {
    navigateTo('/dashboard')
  }, 3000)
})
</script>
