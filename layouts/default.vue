<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Spinner de carga mientras se verifica la autenticación -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Contenido principal cuando el usuario está autenticado -->
    <div v-else-if="user">
      <!-- Navegación superior -->
      <LayoutTopNavigation />
      
      <!-- Contenido principal -->
      <main>
        <slot />
      </main>
    </div>
    
    <!-- Redirección si no está autenticado (manejado por middleware) -->
  </div>
</template>

<script setup lang="ts">
// Auth
const { user } = useSupabaseMaster()
const pending = ref(true)

// Handle authentication
watch(user, (newUser) => {
  pending.value = false
  if (!newUser) {
    navigateTo('/auth/login')
  }
}, { immediate: true })

// Inicializar pending como false después de un tiempo
onMounted(() => {
  setTimeout(() => {
    pending.value = false
  }, 1000)
})
</script>