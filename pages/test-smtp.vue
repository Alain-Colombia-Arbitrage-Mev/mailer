<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Test SMTP Configuration</h1>
      
      <!-- Verificación de Conexión -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔌 Verificar Conexión SMTP</h2>
        <button 
          @click="testConnection" 
          :disabled="testing"
          class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ testing ? 'Verificando...' : 'Verificar Conexión' }}
        </button>
        
        <div v-if="connectionResult" class="mt-4 p-4 rounded" :class="connectionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p class="font-semibold">{{ connectionResult.success ? '✅ Conexión exitosa' : '❌ Error de conexión' }}</p>
          <p v-if="connectionResult.error" class="text-sm mt-1">{{ connectionResult.error }}</p>
        </div>
      </div>

      <!-- Prueba Alternativa con Email Real -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🧪 Prueba Alternativa - Envío Real</h2>
        <p class="text-sm text-gray-600 mb-4">
          Si la verificación de conexión falla, prueba enviando un email real para verificar que las credenciales funcionen.
        </p>
        
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tu Email para Prueba
            </label>
            <input 
              v-model="alternativeTestEmail"
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu-email@example.com"
            >
          </div>
          <button 
            @click="testWithRealEmail" 
            :disabled="testingAlternative || !alternativeTestEmail"
            class="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {{ testingAlternative ? 'Enviando...' : 'Probar con Email Real' }}
          </button>
        </div>
        
        <div v-if="alternativeResult" class="mt-4 p-4 rounded" :class="alternativeResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p class="font-semibold">{{ alternativeResult.success ? '✅ Email enviado exitosamente' : '❌ Error enviando email' }}</p>
          <p v-if="alternativeResult.messageId" class="text-sm mt-1">Message ID: {{ alternativeResult.messageId }}</p>
          <p v-if="alternativeResult.error" class="text-sm mt-1">{{ alternativeResult.error }}</p>
          <p v-if="alternativeResult.success" class="text-sm mt-1">Revisa tu bandeja de entrada (y spam) para confirmar que llegó.</p>
        </div>
      </div>

      <!-- Envío de Email de Prueba -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">📧 Enviar Email de Prueba</h2>
        
        <form @submit.prevent="sendTestEmail" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email Destinatario
            </label>
            <input 
              v-model="testEmail.to"
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <input 
              v-model="testEmail.subject"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email de prueba SMTP"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea 
              v-model="testEmail.content"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Este es un email de prueba enviado desde el sistema SMTP..."
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input 
              v-model="testEmail.isHtml"
              type="checkbox" 
              id="isHtml"
              class="mr-2"
            >
            <label for="isHtml" class="text-sm text-gray-700">
              Enviar como HTML
            </label>
          </div>
          
          <button 
            type="submit"
            :disabled="sending"
            class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ sending ? 'Enviando...' : 'Enviar Email' }}
          </button>
        </form>
        
        <div v-if="sendResult" class="mt-4 p-4 rounded" :class="sendResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p class="font-semibold">{{ sendResult.success ? '✅ Email enviado exitosamente' : '❌ Error enviando email' }}</p>
          <p v-if="sendResult.messageId" class="text-sm mt-1">Message ID: {{ sendResult.messageId }}</p>
          <p v-if="sendResult.error" class="text-sm mt-1">{{ sendResult.error }}</p>
        </div>
      </div>

      <!-- Verificar Estado AWS SES -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">🔍 Estado de AWS SES</h2>
        <p class="text-sm text-gray-600 mb-4">
          Verifica el estado de tu cuenta AWS SES y las configuraciones de dominio/email.
        </p>
        
        <button 
          @click="checkSESStatus" 
          :disabled="checkingSES"
          class="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {{ checkingSES ? 'Verificando...' : 'Verificar Estado AWS SES' }}
        </button>
        
        <div v-if="sesStatus" class="mt-4 p-4 rounded" :class="sesStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          <p class="font-semibold">{{ sesStatus.success ? '✅ Verificación completada' : '❌ Error en verificación' }}</p>
          <div v-if="sesStatus.recommendations" class="mt-2 text-sm">
            <p class="font-medium">Recomendaciones:</p>
            <ul class="list-disc list-inside">
              <li v-for="rec in sesStatus.recommendations" :key="rec">{{ rec }}</li>
            </ul>
          </div>
          <p v-if="sesStatus.testMessageId" class="text-sm mt-2">Message ID: {{ sesStatus.testMessageId }}</p>
          <p v-if="sesStatus.error" class="text-sm mt-2">Error: {{ sesStatus.error }}</p>
        </div>
      </div>

      <!-- Configuración SMTP Actual -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">⚙️ Configuración SMTP</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium text-gray-700">Host:</p>
            <p class="text-gray-600">email-smtp.us-east-1.amazonaws.com</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Puerto:</p>
            <p class="text-gray-600">587</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Usuario:</p>
            <p class="text-gray-600">AKIAXTORPJBRNRZLIA5D</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Seguridad:</p>
            <p class="text-gray-600">STARTTLS</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">From Name:</p>
            <p class="text-gray-600">BMP Support</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Reply To:</p>
            <p class="text-gray-600">info@be-mindpower.net</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const testing = ref(false)
const sending = ref(false)
const testingAlternative = ref(false)
const checkingSES = ref(false)
const connectionResult = ref(null)
const sendResult = ref(null)
const alternativeResult = ref(null)
const sesStatus = ref(null)
const alternativeTestEmail = ref('')

const testEmail = ref({
  to: '',
  subject: 'Email de prueba SMTP - BMP',
  content: '<h1>¡Hola!</h1><p>Este es un email de prueba enviado desde el sistema SMTP de Be-Mindpower.</p><p>Si recibes este mensaje, la configuración SMTP está funcionando correctamente.</p>',
  isHtml: true
})

const testConnection = async () => {
  testing.value = true
  connectionResult.value = null
  
  try {
    const response = await $fetch('/api/smtp/test-connection', {
      method: 'POST'
    })
    
    connectionResult.value = response
  } catch (error: any) {
    connectionResult.value = {
      success: false,
      error: error.data?.message || error.message || 'Error desconocido'
    }
  } finally {
    testing.value = false
  }
}

const sendTestEmail = async () => {
  sending.value = true
  sendResult.value = null
  
  try {
    const response = await $fetch('/api/emails/send', {
      method: 'POST',
      body: {
        recipients: [testEmail.value.to],
        subject: testEmail.value.subject,
        content: testEmail.value.content,
        isHtml: testEmail.value.isHtml,
        sender: 'info@be-mindpower.net'
      }
    })
    
    if (response.success && response.sent > 0) {
      sendResult.value = {
        success: true,
        messageId: response.results[0]?.messageId
      }
    } else {
      sendResult.value = {
        success: false,
        error: response.errors?.[0]?.error || 'Error desconocido'
      }
    }
  } catch (error: any) {
    sendResult.value = {
      success: false,
      error: error.data?.message || error.message || 'Error desconocido'
    }
  } finally {
    sending.value = false
  }
}

const testWithRealEmail = async () => {
  testingAlternative.value = true
  alternativeResult.value = null
  
  try {
    const response = await $fetch('/api/smtp/test-with-email', {
      method: 'POST',
      body: {
        email: alternativeTestEmail.value
      }
    })
    
    alternativeResult.value = response
  } catch (error: any) {
    alternativeResult.value = {
      success: false,
      error: error.data?.message || error.message || 'Error desconocido'
    }
  } finally {
    testingAlternative.value = false
  }
}

const checkSESStatus = async () => {
  checkingSES.value = true
  sesStatus.value = null
  
  try {
    const response = await $fetch('/api/smtp/check-ses-status', {
      method: 'POST'
    })
    
    sesStatus.value = response
  } catch (error: any) {
    sesStatus.value = {
      success: false,
      error: error.data?.message || error.message || 'Error desconocido',
      recommendations: ['Error al verificar estado de AWS SES']
    }
  } finally {
    checkingSES.value = false
  }
}
</script>
