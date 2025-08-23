<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h1 class="text-xl font-bold mb-4">Test Creación de Admin</h1>
      
      <div class="space-y-4">
        <button
          @click="createAdmin"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Creando...' : 'Crear Usuario Admin' }}
        </button>
        
        <div v-if="result" class="p-4 rounded" :class="result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
          <h3 class="font-medium">{{ result.success ? 'Éxito' : 'Error' }}</h3>
          <p class="text-sm mt-1">{{ result.message }}</p>
          <pre v-if="result.details" class="text-xs mt-2 overflow-auto">{{ JSON.stringify(result.details, null, 2) }}</pre>
        </div>
        
        <button
          @click="testLogin"
          :disabled="loading"
          class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {{ loading ? 'Probando...' : 'Probar Login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const loading = ref(false)
const result = ref(null)

const createAdmin = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/auth/create-admin', {
      method: 'POST'
    })
    
    result.value = {
      success: true,
      message: response.message,
      details: response
    }
  } catch (error: any) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: error.data?.statusMessage || error.message || 'Error desconocido',
      details: error
    }
  } finally {
    loading.value = false
  }
}

const testLogin = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/auth/admin-login', {
      method: 'POST',
      body: {
        email: 'admin@be-mindpower.net',
        password: 'BMP@Admin2024!'
      }
    })
    
    result.value = {
      success: true,
      message: 'Login exitoso: ' + response.message,
      details: response
    }
  } catch (error: any) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: error.data?.statusMessage || error.message || 'Error desconocido',
      details: error
    }
  } finally {
    loading.value = false
  }
}
</script>

