<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
          <ExclamationTriangleIcon class="h-6 w-6 text-orange-600" />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Confirmación Manual Requerida
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Debido al rate limit de emails, necesitas confirmar el usuario manualmente
        </p>
      </div>

      <!-- Instructions -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          📋 Instrucciones paso a paso
        </h3>
        
        <div class="space-y-6">
          <!-- Step 1 -->
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                1
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Accede al Panel de Supabase</h4>
              <p class="mt-1 text-sm text-gray-600">
                Ve a <a href="https://supabase.com/dashboard" target="_blank" class="text-blue-600 hover:text-blue-500">supabase.com/dashboard</a>
                e inicia sesión con tu cuenta.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                2
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Selecciona tu Proyecto</h4>
              <p class="mt-1 text-sm text-gray-600">
                Busca y selecciona el proyecto que corresponde a esta aplicación.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                3
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Ve a Authentication</h4>
              <p class="mt-1 text-sm text-gray-600">
                En el menú lateral, haz clic en <strong>"Authentication"</strong> → <strong>"Users"</strong>
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm font-medium">
                4
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Busca el Usuario</h4>
              <p class="mt-1 text-sm text-gray-600">
                Busca el usuario con email: <code class="bg-gray-100 px-2 py-1 rounded text-sm">info@be-mindpower.net</code>
              </p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white text-sm font-medium">
                5
              </div>
            </div>
            <div class="ml-4">
              <h4 class="text-sm font-medium text-gray-900">Confirma el Email</h4>
              <p class="mt-1 text-sm text-gray-600">
                Haz clic en el usuario y busca la opción para <strong>"Confirm email"</strong> o cambiar el estado a confirmado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alternative Solutions -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-yellow-800 mb-4">
          🔧 Soluciones Alternativas
        </h3>
        
        <div class="space-y-4 text-sm text-yellow-700">
          <div>
            <h4 class="font-medium">Opción 1: Deshabilitar confirmación de email</h4>
            <p>En Supabase Dashboard → Authentication → Settings → "Enable email confirmations" (desactivar)</p>
          </div>
          
          <div>
            <h4 class="font-medium">Opción 2: Usar un email real</h4>
            <p>Cambia el email del super usuario a uno que puedas acceder para recibir el email de confirmación</p>
          </div>
          
          <div>
            <h4 class="font-medium">Opción 3: Esperar el rate limit</h4>
            <p>Espera 5-10 minutos y vuelve a intentar el registro</p>
          </div>
        </div>
      </div>

      <!-- Current Status -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-blue-800 mb-4">
          📊 Estado Actual
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-medium text-blue-800">Super Usuario</h4>
            <p class="text-blue-700">Email: info@be-mindpower.net</p>
            <p class="text-blue-700">Contraseña: Bemind.2025+++</p>
          </div>
          <div>
            <h4 class="font-medium text-blue-800">Estado</h4>
            <p class="text-blue-700">✅ Usuario creado</p>
            <p class="text-blue-700">⏳ Pendiente confirmación</p>
          </div>
        </div>
      </div>

      <!-- Test Login -->
      <div class="text-center space-y-4">
        <button
          @click="testLogin"
          :disabled="testing"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="testing" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Probando login...
          </span>
          <span v-else>
            🧪 Probar Login del Super Usuario
          </span>
        </button>

        <div v-if="loginResult" class="text-sm">
          <div v-if="loginResult.success" class="text-green-600">
            ✅ ¡Login exitoso! El super usuario está listo.
          </div>
          <div v-else class="text-red-600">
            ❌ {{ loginResult.error }}
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-center space-x-4">
        <NuxtLink
          to="/auth/login"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          ← Volver al Login
        </NuxtLink>
        <NuxtLink
          to="/auth/register-admin"
          class="font-medium text-purple-600 hover:text-purple-500"
        >
          Intentar Registro de Nuevo
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Composables
const { signInWithPassword } = useSupabaseCorrect()

// State
const testing = ref(false)
const loginResult = ref<{ success: boolean; error?: string } | null>(null)

/**
 * Probar login del super usuario
 */
const testLogin = async () => {
  testing.value = true
  loginResult.value = null

  try {
    const result = await signInWithPassword('info@be-mindpower.net', 'Bemind.2025+++')
    
    if (result.success) {
      loginResult.value = { success: true }
      // Redirigir al dashboard después de un momento
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 2000)
    } else {
      loginResult.value = { success: false, error: result.error }
    }
  } catch (err: any) {
    loginResult.value = { success: false, error: err.message }
  } finally {
    testing.value = false
  }
}

// Metadata
definePageMeta({
  layout: false,
  auth: false
})

useSeoMeta({
  title: 'Confirmación Manual - Mailer Be-Mindpower',
  description: 'Instrucciones para confirmar manualmente el super usuario en Supabase'
})
</script>

