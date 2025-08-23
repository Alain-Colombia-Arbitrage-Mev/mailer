<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; padding: 20px;">
    <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%;">
      <h1 style="text-align: center; margin-bottom: 30px; color: #111827;">Registrar Usuario Admin</h1>
      
      <div style="margin-bottom: 20px;">
        <p><strong>Email:</strong> info@be-mindpower.net</p>
        <p><strong>Contraseña:</strong> Be-mind.2025+++</p>
      </div>
      
      <button
        @click="registerAdmin"
        :disabled="loading"
        style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-bottom: 10px;"
        :style="{ opacity: loading ? 0.5 : 1 }"
      >
        {{ loading ? 'Registrando...' : 'Registrar Usuario Admin' }}
      </button>
      
      <button
        @click="confirmEmail"
        :disabled="loading"
        style="width: 100%; padding: 12px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-bottom: 10px;"
        :style="{ opacity: loading ? 0.5 : 1 }"
      >
        {{ loading ? 'Confirmando...' : 'Confirmar Email Admin' }}
      </button>
      
      <button
        @click="updatePassword"
        :disabled="loading"
        style="width: 100%; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;"
        :style="{ opacity: loading ? 0.5 : 1 }"
      >
        {{ loading ? 'Actualizando...' : 'Actualizar Contraseña en Supabase' }}
      </button>
      
      <div v-if="result" style="margin-top: 20px; padding: 16px; border-radius: 8px;" :style="{ 
        background: result.success ? '#f0fdf4' : '#fef2f2',
        border: result.success ? '1px solid #bbf7d0' : '1px solid #fecaca',
        color: result.success ? '#166534' : '#dc2626'
      }">
        <h3 style="margin: 0 0 8px 0;">{{ result.success ? 'Éxito' : 'Error' }}</h3>
        <p style="margin: 0;">{{ result.message }}</p>
        <pre v-if="result.details" style="margin-top: 12px; font-size: 12px; overflow: auto;">{{ JSON.stringify(result.details, null, 2) }}</pre>
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="/auth/admin-login" style="color: #3b82f6; text-decoration: none;">
          ← Ir al Login
        </a>
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

const registerAdmin = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/auth/register-admin-manual', {
      method: 'POST'
    })
    
    result.value = {
      success: response.success,
      message: response.message,
      details: response
    }
  } catch (error: any) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: error.data?.message || error.message || 'Error desconocido',
      details: error
    }
  } finally {
    loading.value = false
  }
}

const confirmEmail = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/auth/confirm-admin-email', {
      method: 'POST'
    })
    
    result.value = {
      success: response.success,
      message: response.message,
      details: response
    }
  } catch (error: any) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: error.data?.message || error.message || 'Error desconocido',
      details: error
    }
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/auth/update-admin-password', {
      method: 'POST'
    })
    
    result.value = {
      success: response.success,
      message: response.message,
      details: response
    }
  } catch (error: any) {
    console.error('Error:', error)
    result.value = {
      success: false,
      message: error.data?.message || error.message || 'Error desconocido',
      details: error
    }
  } finally {
    loading.value = false
  }
}
</script>
