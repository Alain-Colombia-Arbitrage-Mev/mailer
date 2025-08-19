<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100">
          <UserPlusIcon class="h-6 w-6 text-purple-600" />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Registro de Super Usuario
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Crear cuenta de administrador para Mailer Be-Mindpower
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              ¡Super Usuario Creado!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>{{ successMessage }}</p>
            </div>
            <div class="mt-4">
              <NuxtLink
                to="/auth/login"
                class="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Ir al login →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <XCircleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error en el registro
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <form v-if="!success" class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Super User Info -->
        <div class="rounded-md bg-blue-50 p-4">
          <div class="flex">
            <InformationCircleIcon class="h-5 w-5 text-blue-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Información del Super Usuario
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li><strong>Email:</strong> info@be-mindpower.net</li>
                  <li><strong>Contraseña:</strong> Bemind.2025+++</li>
                  <li><strong>Rol:</strong> Administrador del sistema</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Rate Limit Warning -->
        <div class="rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                ⚠️ Sobre el Rate Limit de Emails
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p class="mb-2">Supabase gratuito limita el envío de emails de confirmación:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Si aparece "email rate limit exceeded", es normal</li>
                  <li>El usuario puede crearse pero necesitar confirmación manual</li>
                  <li>Puedes confirmar usuarios en el panel de Supabase</li>
                  <li>O esperar 5-10 minutos e intentar de nuevo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection Test -->
        <div class="space-y-4">
          <button
            @click="testConnectionFirst"
            type="button"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="testingConnection" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Probando conexión...
            </span>
            <span v-else class="flex items-center">
              <WifiIcon class="h-4 w-4 mr-2" />
              Probar Conexión a Supabase
            </span>
          </button>

          <div v-if="connectionStatus" class="text-sm text-center">
            <span :class="connectionStatus.success ? 'text-green-600' : 'text-red-600'">
              {{ connectionStatus.message }}
            </span>
          </div>
        </div>

        <!-- Register Button -->
        <div>
          <button
            type="submit"
            :disabled="loading || !connectionTested"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </span>
            <UserPlusIcon class="h-4 w-4 mr-2" />
            {{ loading ? 'Creando Super Usuario...' : 'Crear Super Usuario' }}
          </button>
        </div>

        <!-- Info -->
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <ShieldCheckIcon class="h-4 w-4" />
            <span>Registro seguro de administrador</span>
          </div>
        </div>
      </form>

      <!-- Navigation -->
      <div class="text-center space-y-2">
        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/auth/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Volver al login
          </NuxtLink>
          <NuxtLink
            to="/auth/manual-confirmation"
            class="font-medium text-orange-600 hover:text-orange-500"
          >
            📋 Instrucciones Manuales
          </NuxtLink>
        </div>
        <p class="text-xs text-gray-500">
          ¿Rate limit? Usa las instrucciones manuales para confirmar el usuario
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  WifiIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Composables
const { testConnection, sendMagicLink, verifyConfig } = useSupabaseMaster()

// State
const loading = ref(false)
const testingConnection = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')
const connectionStatus = ref<{ success: boolean; message: string } | null>(null)
const connectionTested = ref(false)

/**
 * Probar conexión a Supabase primero
 */
const testConnectionFirst = async () => {
  testingConnection.value = true
  connectionStatus.value = null
  
  try {
    // Verificar URL correcta
    const urlVerification = verifyConfig()
    console.log('🔍 Verificación de URL:', urlVerification)

    // Probar conexión
    const result = await testConnection()
    
    if (result.success) {
      connectionStatus.value = {
        success: true,
        message: '✅ Conexión exitosa a Supabase'
      }
      connectionTested.value = true
    } else {
      connectionStatus.value = {
        success: false,
        message: `❌ Error de conexión: ${result.error}`
      }
    }
  } catch (err: any) {
    connectionStatus.value = {
      success: false,
      message: `💥 Error: ${err.message}`
    }
  } finally {
    testingConnection.value = false
  }
}

/**
 * Manejar registro del super usuario
 */
const handleRegister = async () => {
  if (!connectionTested.value) {
    error.value = 'Por favor, prueba la conexión primero'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('🚀 Iniciando registro de super usuario...')
    
    // Intentar envío de Magic Link para registro/login
    const result = await sendMagicLink('info@be-mindpower.net')

    if (!result.success) {
      console.error('❌ Error en registro:', result.error)
      
      // Mensaje específico para rate limit
      if (result.error?.includes('rate limit')) {
        error.value = `${result.error}\n\n💡 Soluciones:\n1. Espera 5-10 minutos e intenta de nuevo\n2. Ve al panel de Supabase y confirma el usuario manualmente\n3. El usuario puede ya existir pero necesita confirmación`
      } else {
        error.value = result.error || 'Error desconocido'
      }
      return
    }

    console.log('✅ Magic Link enviado exitosamente')
    success.value = true
    successMessage.value = 'Magic Link enviado a info@be-mindpower.net. Revisa tu email para acceder o confirma manualmente en el panel de Supabase.'
    
  } catch (err: any) {
    console.error('💥 Error capturado:', err)
    error.value = err.message || 'Error al crear el super usuario'
  } finally {
    loading.value = false
  }
}

// Metadata
definePageMeta({
  layout: false,
  auth: false
})

useSeoMeta({
  title: 'Registro Super Usuario - Mailer Be-Mindpower',
  description: 'Crear cuenta de super usuario para administrar Mailer Be-Mindpower'
})
</script>
