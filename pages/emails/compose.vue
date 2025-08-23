<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header móvil y desktop -->
    <div class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Navegación izquierda -->
          <div class="flex items-center space-x-4">
            <button
              @click="$router.back()"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </button>
            <div class="hidden sm:block">
              <h1 class="text-xl font-semibold text-gray-900">Componer Email</h1>
            </div>
          </div>

          <!-- Acciones principales -->
          <div class="flex items-center space-x-3">
            <!-- Botón guardar borrador -->
            <button
              @click="saveDraft"
              :disabled="saving"
              class="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <DocumentIcon class="h-4 w-4 mr-2" />
              {{ saving ? 'Guardando...' : 'Borrador' }}
            </button>

            <!-- Botón enviar -->
            <button
              @click="sendEmail"
              :disabled="!canSend || sending"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              <PaperAirplaneIcon class="h-4 w-4 mr-2" />
              {{ sending ? 'Enviando...' : 'Enviar' }}
            </button>

            <!-- Menú móvil -->
            <div class="sm:hidden relative">
              <button
                @click="showMobileMenu = !showMobileMenu"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>
              
              <!-- Dropdown móvil -->
              <div v-if="showMobileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button
                  @click="saveDraft; showMobileMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Guardar Borrador
                </button>
                <button
                  @click="toggleContactSelector; showMobileMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Seleccionar Contactos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Panel principal del editor -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Tarjeta de destinatarios y asunto -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Detalles del Email</h2>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Destinatarios mejorados -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">
                    Para <span class="text-red-500">*</span>
                  </label>
                  <button
                    @click="toggleContactSelector"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📋 Seleccionar Contactos
                  </button>
                </div>
                
                <div class="recipients-container">
                  <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[48px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
                    <!-- Tags de destinatarios -->
                    <TransitionGroup name="recipient" tag="div" class="flex flex-wrap gap-2">
                      <div
                        v-for="(recipient, index) in recipients"
                        :key="recipient"
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        <span class="truncate max-w-[200px]">{{ recipient }}</span>
                        <button
                          @click="removeRecipient(index)"
                          class="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <XMarkIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </TransitionGroup>
                    
                    <!-- Input para nuevos destinatarios -->
                    <input
                      v-model="newRecipient"
                      @keydown.enter.prevent="addRecipient"
                      @keydown.comma.prevent="addRecipient"
                      @input="handleRecipientInput"
                      @paste="handlePaste"
                      type="email"
                      placeholder="Agregar email..."
                      class="flex-1 min-w-[200px] border-none outline-none focus:ring-0 bg-transparent"
                    />
                  </div>
                  
                  <div class="mt-2 flex items-center justify-between">
                    <p class="text-sm text-gray-500">
                      Separa múltiples emails con comas. Total: {{ recipients.length }}
                    </p>
                    <div v-if="recipients.length > 0" class="text-sm text-gray-400">
                      {{ recipients.length }} destinatario{{ recipients.length !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Asunto mejorado -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Asunto <span class="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  v-model="emailData.subject"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Escribe un asunto atractivo..."
                />
                <div class="mt-1 flex justify-between text-sm text-gray-500">
                  <span>Un buen asunto aumenta la tasa de apertura</span>
                  <span>{{ emailData.subject.length }}/100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Editor de contenido -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Contenido del Email</h2>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">Modo:</span>
                  <button
                    @click="toggleHtmlMode"
                    :class="isHtmlMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    {{ isHtmlMode ? 'HTML' : 'Visual' }}
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-0">
              <!-- Editor profesional -->
              <EmailEditorPro
                v-model="emailData.content"
                :subject="emailData.subject"
                :from-email="user?.email || 'info@be-mindpower.net'"
              />
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Adjuntos -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900 flex items-center">
                <PaperClipIcon class="h-4 w-4 mr-2" />
                Adjuntos
              </h3>
            </div>
            
            <div class="p-4">
              <!-- Zona de drop mejorada -->
              <div
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                :class="{
                  'border-blue-500 bg-blue-50': isDragging,
                  'border-gray-300': !isDragging
                }"
                class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                @click="$refs.fileInput?.click()"
              >
                <CloudArrowUpIcon class="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p class="text-sm text-gray-600 font-medium">
                  Arrastra archivos aquí
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  o haz clic para seleccionar
                </p>
                <p class="text-xs text-gray-400 mt-2">
                  Máximo 10MB por archivo
                </p>
              </div>
              
              <input
                ref="fileInput"
                type="file"
                multiple
                @change="handleFileSelect"
                class="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
              />

              <!-- Lista de adjuntos mejorada -->
              <div v-if="attachments.length > 0" class="mt-4 space-y-2">
                <TransitionGroup name="attachment" tag="div" class="space-y-2">
                  <div
                    v-for="(attachment, index) in attachments"
                    :key="attachment.name + index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                      <div class="flex-shrink-0">
                        <DocumentIcon class="h-5 w-5 text-gray-500" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ attachment.name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatFileSize(attachment.size) }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="removeAttachment(index)"
                      class="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                  </div>
                </TransitionGroup>
                
                <div class="pt-2 border-t border-gray-200">
                  <p class="text-xs text-gray-500 text-center">
                    {{ attachments.length }} archivo{{ attachments.length !== 1 ? 's' : '' }} 
                    ({{ formatTotalSize() }})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas rápidas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Resumen</h3>
            </div>
            <div class="p-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Destinatarios:</span>
                <span class="font-medium">{{ recipients.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Adjuntos:</span>
                <span class="font-medium">{{ attachments.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Caracteres:</span>
                <span class="font-medium">{{ contentLength }}</span>
              </div>
              <div class="pt-2 border-t border-gray-200">
                <div class="flex items-center text-sm">
                  <div class="flex-1">
                    <div class="flex justify-between mb-1">
                      <span class="text-gray-600">Completado:</span>
                      <span class="font-medium">{{ completionPercentage }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: completionPercentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Acciones Rápidas</h3>
            </div>
            <div class="p-4 space-y-2">
              <button
                @click="saveDraft"
                :disabled="saving"
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                <DocumentIcon class="h-4 w-4 mr-2" />
                {{ saving ? 'Guardando...' : 'Guardar Borrador' }}
              </button>
              
              <button
                @click="clearAll"
                class="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de selector de contactos -->
    <ContactSelectorModal
      v-if="showContactSelector"
      @close="showContactSelector = false"
      @select="handleContactsSelected"
    />

    <!-- Toast de notificaciones -->
    <div v-if="showToast" class="fixed bottom-4 right-4 z-50">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckIcon v-if="toastType === 'success'" class="h-5 w-5 text-green-500" />
            <XMarkIcon v-else class="h-5 w-5 text-red-500" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import {
  ArrowLeftIcon,
  DocumentIcon,
  PaperAirplaneIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckIcon,
  PaperClipIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Proteger la ruta
definePageMeta({ middleware: 'admin' })

// Composables
const { user } = useSupabaseMaster()
const { uploadFile } = useFileUpload()

// Estado del formulario
const emailData = reactive({
  subject: '',
  content: '',
  isHtml: true
})

// Estado de la UI
const recipients = ref<string[]>([])
const newRecipient = ref('')
const attachments = ref<File[]>([])
const isDragging = ref(false)
const sending = ref(false)
const saving = ref(false)
const isHtmlMode = ref(true)
const showContactSelector = ref(false)
const showMobileMenu = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Referencias
const fileInput = ref<HTMLInputElement>()

// Computed
const canSend = computed(() => {
  return recipients.value.length > 0 && 
         emailData.subject.trim() && 
         emailData.content.trim() && 
         !sending.value
})

const contentLength = computed(() => {
  const div = document.createElement('div')
  div.innerHTML = emailData.content
  return div.textContent?.length || 0
})

const completionPercentage = computed(() => {
  let score = 0
  if (recipients.value.length > 0) score += 30
  if (emailData.subject.trim()) score += 30
  if (emailData.content.trim()) score += 40
  return Math.min(score, 100)
})

// Métodos para destinatarios (mejorados)
const addRecipient = () => {
  const input = newRecipient.value.trim()
  if (!input) return
  
  const emails = input.split(',').map(email => email.trim()).filter(email => email)
  
  emails.forEach(email => {
    if (isValidEmail(email) && !recipients.value.includes(email)) {
      recipients.value.push(email)
    }
  })
  
  newRecipient.value = ''
}

const removeRecipient = (index: number) => {
  recipients.value.splice(index, 1)
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleRecipientInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value.includes(',')) {
    nextTick(() => {
      addRecipient()
    })
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  
  if (pastedText.trim()) {
    newRecipient.value = (newRecipient.value + pastedText).trim()
    
    if (pastedText.includes(',') || pastedText.includes(' ') || pastedText.includes(';')) {
      nextTick(() => {
        newRecipient.value = newRecipient.value
          .replace(/[;\s]+/g, ',')
          .replace(/,+/g, ',')
        addRecipient()
      })
    }
  }
}

// Métodos de archivos
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    Array.from(target.files).forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB
        attachments.value.push(file)
      } else {
        showToastMessage('Archivo demasiado grande: ' + file.name, 'error')
      }
    })
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files) {
    Array.from(event.dataTransfer.files).forEach(file => {
      if (file.size <= 10 * 1024 * 1024) {
        attachments.value.push(file)
      } else {
        showToastMessage('Archivo demasiado grande: ' + file.name, 'error')
      }
    })
  }
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatTotalSize = () => {
  const total = attachments.value.reduce((sum, file) => sum + file.size, 0)
  return formatFileSize(total)
}

// Métodos principales
const sendEmail = async () => {
  if (!canSend.value) return
  
  sending.value = true
  try {
    let response
    
    if (attachments.value.length > 0) {
      const formData = new FormData()
      formData.append('recipients', JSON.stringify(recipients.value))
      formData.append('subject', emailData.subject)
      formData.append('content', emailData.content)
      formData.append('isHtml', String(emailData.isHtml))
      formData.append('sender', user.value?.email || 'info@be-mindpower.net')
      
      attachments.value.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
      })

      response = await $fetch('/api/emails/send-with-files', {
        method: 'POST',
        body: formData
      })
    } else {
      const emailPayload = {
        recipients: recipients.value,
        subject: emailData.subject,
        content: emailData.content,
        isHtml: emailData.isHtml,
        attachments: [],
        sender: user.value?.email || 'info@be-mindpower.net'
      }

      response = await $fetch('/api/emails/send', {
        method: 'POST',
        body: emailPayload
      })
    }

    if (response.success) {
      showToastMessage(`Email enviado exitosamente a ${response.sent} destinatarios`, 'success')
      clearAll()
    } else {
      throw new Error(response.message || 'Error al enviar email')
    }
  } catch (error: any) {
    console.error('Error enviando email:', error)
    showToastMessage('Error al enviar email: ' + error.message, 'error')
  } finally {
    sending.value = false
  }
}

const saveDraft = async () => {
  saving.value = true
  try {
    // Implementar guardado de borrador
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToastMessage('Borrador guardado', 'success')
  } catch (error) {
    showToastMessage('Error al guardar borrador', 'error')
  } finally {
    saving.value = false
  }
}

const clearAll = () => {
  if (confirm('¿Estás seguro de que quieres limpiar todo el contenido?')) {
    recipients.value = []
    newRecipient.value = ''
    emailData.subject = ''
    emailData.content = ''
    attachments.value = []
  }
}

const toggleHtmlMode = () => {
  isHtmlMode.value = !isHtmlMode.value
}

const toggleContactSelector = () => {
  showContactSelector.value = !showContactSelector.value
}

const handleContactsSelected = (selectedContacts: any[]) => {
  selectedContacts.forEach(contact => {
    if (contact.email && !recipients.value.includes(contact.email)) {
      recipients.value.push(contact.email)
    }
  })
  showContactSelector.value = false
}

const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Inicialización
onMounted(() => {
  // Leer parámetros URL para prellenar destinatarios
  const route = useRoute()
  if (route.query.to) {
    const emailParam = route.query.to as string
    const emails = emailParam.split(',').map(email => email.trim()).filter(email => email)
    
    emails.forEach(email => {
      if (!recipients.value.includes(email)) {
        recipients.value.push(email)
      }
    })
  }

  if (route.query.subject) {
    emailData.subject = route.query.subject as string
  }

  if (route.query.body || route.query.content) {
    const content = (route.query.body || route.query.content) as string
    emailData.content = content
  }
})
</script>

<style scoped>
/* Transiciones */
.recipient-enter-active,
.recipient-leave-active {
  transition: all 0.3s ease;
}

.recipient-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.recipient-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.attachment-enter-active,
.attachment-leave-active {
  transition: all 0.3s ease;
}

.attachment-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.attachment-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive mejoras */
@media (max-width: 640px) {
  .recipients-container .truncate {
    max-width: 120px;
  }
}

/* Mejoras visuales */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>


