<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="isProcessing" class="space-y-4">
        <div class="spinner-lg mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Procesando autenticación...
        </h2>
        <p class="text-gray-600">
          {{ statusMessage }}
        </p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
          <XCircleIcon class="h-6 w-6 text-red-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Error de Autenticación
        </h2>
        <p class="text-red-600 mb-4">
          {{ error }}
        </p>
        <button
          @click="$router.push('/login')"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Volver al Login
        </button>
      </div>

      <div v-else-if="success" class="space-y-4">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
          <CheckIcon class="h-6 w-6 text-green-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          ¡Autenticación Exitosa!
        </h2>
        <p class="text-green-600">
          Redirigiendo al dashboard...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XCircleIcon, CheckIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false,
  auth: false
})

// Estado del componente
const isProcessing = ref(true)
const success = ref(false)
const error = ref('')
const statusMessage = ref('Verificando tu Magic Link...')

// Sistema con URL correcta forzada
const { supabaseUser, supabaseSession, correctSupabaseClient } = useCorrectSupabase()

// Manejar el callback de autenticación
onMounted(async () => {
  try {
    console.log('🔄 Iniciando callback de Magic Link...')
    
    statusMessage.value = 'Procesando Magic Link...'
    
    // Procesar la sesión de la URL (esto es automático con Supabase)
    const { data, error: sessionError } = await correctSupabaseClient.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError)
      error.value = sessionError.message
      isProcessing.value = false
      return
    }
    
    if (data.session && data.session.user) {
      console.log('✅ Usuario autenticado via callback:', data.session.user.email)
      statusMessage.value = 'Configurando sesión...'
      
      // Sincronizar con localStorage
      if (process.client) {
        const sessionData = {
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || data.session.user.email,
            isAdmin: data.session.user.email === 'info@be-mindpower.net'
          },
          session: data.session,
          timestamp: Date.now(),
          isAuthenticated: true
        }
        
        localStorage.setItem('admin_session', JSON.stringify(sessionData))
        localStorage.setItem('auth_status', 'authenticated')
      }
      
      success.value = true
      isProcessing.value = false
      
      // Redirigir al dashboard
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 1500)
      
      return
    }
    
    // Si no hay sesión después de 5 segundos, mostrar error
    setTimeout(() => {
      if (isProcessing.value) {
        console.error('❌ Timeout - No se detectó sesión válida')
        error.value = 'El enlace de acceso ha expirado o es inválido. Intenta generar uno nuevo.'
        isProcessing.value = false
      }
    }, 5000)
    
  } catch (err: any) {
    console.error('❌ Error en callback:', err)
    error.value = err.message || 'Error procesando el enlace de acceso'
    isProcessing.value = false
  }
})

// Watcher para detectar cambios en el usuario
watch(supabaseUser, (newUser) => {
  if (newUser && isProcessing.value) {
    console.log('👤 Usuario detectado:', newUser.email)
    
    // Procesar autenticación exitosa
    success.value = true
    isProcessing.value = false
    
    // Sincronizar sesión
    if (process.client && supabaseSession.value) {
      const sessionData = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: 'Administrador',
          isAdmin: true
        },
        session: supabaseSession.value,
        timestamp: Date.now(),
        isAuthenticated: true
      }
      
      localStorage.setItem('admin_session', JSON.stringify(sessionData))
      localStorage.setItem('auth_status', 'authenticated')
    }
    
    // Redirigir
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1500)
  }
}, { immediate: true })

// SEO
useSeoMeta({
  title: 'Verificando Acceso - Mailer Be-Mindpower'
})
</script>

<style scoped>
.spinner-lg {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto;
}
</style>
