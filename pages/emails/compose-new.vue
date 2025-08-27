<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Componer Email</h1>
            <p class="text-gray-600">Envío individual o masivo con archivos adjuntos</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-500">
              Usuario: {{ currentUser?.email }}
            </div>
            <button
              @click="$router.push('/dashboard')"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Panel Principal del Email -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Destinatarios -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <UsersIcon class="h-5 w-5 mr-2 text-blue-600" />
              Destinatarios
            </h3>

            <!-- Selector de Tipo de Envío -->
            <div class="mb-4 flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="emailData.sendType"
                  value="single"
                  class="mr-2"
                >
                📧 Envío Individual
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="emailData.sendType"
                  value="mass"
                  class="mr-2"
                >
                📨 Envío Masivo
              </label>
            </div>

            <!-- Envío Individual -->
            <div v-if="emailData.sendType === 'single'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Email del Destinatario:</label>
                <input
                  v-model="emailData.singleRecipient"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>

            <!-- Envío Masivo -->
            <div v-if="emailData.sendType === 'mass'" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">
                  Contactos de Supabase: {{ filteredContacts.length }}
                </span>
                <button
                  @click="refreshContacts"
                  :disabled="contactsLoading"
                  class="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                >
                  <ArrowPathIcon class="h-4 w-4 inline mr-1" />
                  {{ contactsLoading ? 'Cargando...' : 'Actualizar' }}
                </button>
              </div>

              <!-- Filtro de Contactos -->
              <div>
                <input
                  v-model="contactsFilter"
                  type="text"
                  placeholder="Buscar contactos por email o nombre..."
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
              </div>

              <!-- Lista de Contactos -->
              <div class="max-h-40 overflow-y-auto border rounded-md">
                <div v-if="contactsLoading" class="p-4 text-center text-gray-500">
                  Cargando contactos...
                </div>
                <div v-else-if="filteredContacts.length === 0" class="p-4 text-center text-gray-500">
                  No hay contactos disponibles
                </div>
                <div v-else class="space-y-1 p-2">
                  <label 
                    v-for="contact in filteredContacts.slice(0, 50)" 
                    :key="contact.id"
                    class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="contact.email"
                      v-model="emailData.selectedRecipients"
                      class="mr-3"
                    >
                    <div class="flex-1">
                      <div class="text-sm font-medium">{{ contact.email }}</div>
                      <div v-if="contact.name" class="text-xs text-gray-500">{{ contact.name }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Acciones de Selección Masiva -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">
                  {{ emailData.selectedRecipients.length }} seleccionados
                </span>
                <div class="space-x-2">
                  <button
                    @click="selectAllContacts"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Seleccionar Todos
                  </button>
                  <button
                    @click="emailData.selectedRecipients = []"
                    class="text-red-600 hover:text-red-800"
                  >
                    Deseleccionar Todos
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenido del Email -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <EnvelopeIcon class="h-5 w-5 mr-2 text-blue-600" />
              Contenido del Email
            </h3>

            <div class="space-y-4">
              <!-- Asunto -->
              <div>
                <label class="block text-sm font-medium mb-2">Asunto:</label>
                <input
                  v-model="emailData.subject"
                  type="text"
                  placeholder="Asunto del email..."
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
              </div>

              <!-- Contenido -->
              <div>
                <label class="block text-sm font-medium mb-2">Mensaje:</label>
                <textarea
                  v-model="emailData.content"
                  rows="12"
                  placeholder="Escribe tu mensaje aquí..."
                  class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <div class="text-xs text-gray-500 mt-1">
                  Caracteres: {{ emailData.content.length }}
                </div>
              </div>
            </div>
          </div>

          <!-- Archivos Adjuntos -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <PaperClipIcon class="h-5 w-5 mr-2 text-blue-600" />
              Archivos Adjuntos
              <span class="ml-2 text-sm font-normal text-gray-500">
                ({{ attachments.length }}/10)
              </span>
            </h3>

            <!-- Zona de Drop -->
            <div
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              ]"
            >
              <CloudArrowUpIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p class="text-gray-600 mb-2">
                Arrastra archivos aquí o 
                <button
                  @click="$refs.fileInput?.click()"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  selecciona archivos
                </button>
              </p>
              <p class="text-xs text-gray-500">
                Máximo 50MB por archivo. Formatos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, imágenes
              </p>
            </div>

            <input
              ref="fileInput"
              type="file"
              multiple
              :accept="allowedFileTypes"
              @change="handleFileSelect"
              class="hidden"
            >

            <!-- Lista de Archivos Adjuntos -->
            <div v-if="attachments.length > 0" class="mt-4 space-y-2">
              <div 
                v-for="(attachment, index) in attachments" 
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div class="flex items-center flex-1 min-w-0">
                  <DocumentIcon class="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium truncate">{{ attachment.fileName }}</div>
                    <div class="text-xs text-gray-500">
                      {{ formatFileSize(attachment.fileSize) }}
                      <span v-if="attachment.uploaded" class="text-green-600 ml-2">✓ Subido</span>
                      <span v-else-if="attachment.uploading" class="text-blue-600 ml-2">⏳ Subiendo...</span>
                      <span v-else-if="attachment.error" class="text-red-600 ml-2">❌ Error</span>
                    </div>
                  </div>
                </div>
                <button
                  @click="removeAttachment(index)"
                  :disabled="attachment.uploading"
                  class="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Progreso de Subida -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4">
              <div class="text-sm text-gray-600 mb-1">Subiendo archivos... {{ uploadProgress }}%</div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Botón de Envío -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                <div v-if="emailData.sendType === 'single'">
                  Envío a: {{ emailData.singleRecipient || 'No especificado' }}
                </div>
                <div v-if="emailData.sendType === 'mass'">
                  Envío masivo a {{ emailData.selectedRecipients.length }} contactos
                </div>
                <div v-if="attachments.length > 0">
                  Con {{ attachments.length }} archivo(s) adjunto(s)
                </div>
              </div>

              <button
                @click="sendEmail"
                :disabled="!canSendEmail || isSending"
                class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <PaperAirplaneIcon class="h-5 w-5" />
                <span v-if="isSending">Enviando...</span>
                <span v-else>{{ emailData.sendType === 'mass' ? 'Enviar Masivo' : 'Enviar Email' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="space-y-6">
          <!-- Vista Previa -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Vista Previa</h3>
            <div class="text-sm space-y-2">
              <div><strong>De:</strong> {{ currentUser?.email }}</div>
              <div><strong>Asunto:</strong> {{ emailData.subject || 'Sin asunto' }}</div>
              <div><strong>Destinatarios:</strong> 
                <span v-if="emailData.sendType === 'single'">
                  {{ emailData.singleRecipient || 'No especificado' }}
                </span>
                <span v-if="emailData.sendType === 'mass'">
                  {{ emailData.selectedRecipients.length }} contactos
                </span>
              </div>
              <div><strong>Adjuntos:</strong> {{ attachments.length }}</div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Estadísticas</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Total Contactos:</span>
                <span>{{ contactsStats.total }}</span>
              </div>
              <div class="flex justify-between">
                <span>Filtrados:</span>
                <span>{{ filteredContacts.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Seleccionados:</span>
                <span>{{ emailData.selectedRecipients.length }}</span>
              </div>
            </div>
          </div>

          <!-- Historial Reciente -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Historial</h3>
            <div class="text-sm text-gray-500">
              Últimos envíos aparecerán aquí
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Envío</h3>
        <div class="space-y-2 text-sm mb-6">
          <div><strong>Tipo:</strong> {{ emailData.sendType === 'mass' ? 'Envío Masivo' : 'Envío Individual' }}</div>
          <div><strong>Destinatarios:</strong> 
            {{ emailData.sendType === 'mass' ? emailData.selectedRecipients.length : '1' }}
          </div>
          <div><strong>Asunto:</strong> {{ emailData.subject }}</div>
          <div><strong>Adjuntos:</strong> {{ attachments.length }}</div>
        </div>
        <div class="flex space-x-3">
          <button
            @click="showConfirmModal = false"
            class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            @click="confirmSendEmail"
            :disabled="isSending"
            class="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isSending ? 'Enviando...' : 'Confirmar Envío' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de Notificaciones -->
    <div v-if="showToast" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg',
        toastType === 'success' ? 'bg-green-500 text-white' : 
        toastType === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
      ]">
        <div class="flex items-center space-x-2">
          <CheckIcon v-if="toastType === 'success'" class="h-5 w-5" />
          <XCircleIcon v-if="toastType === 'error'" class="h-5 w-5" />
          <InformationCircleIcon v-if="toastType === 'info'" class="h-5 w-5" />
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UsersIcon,
  EnvelopeIcon,
  PaperClipIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  TrashIcon,
  PaperAirplaneIcon,
  CheckIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Middleware y configuración
// definePageMeta({ middleware: 'clean-auth' }) // BYPASS TEMPORAL

// Composables - usando URL correcta forzada
// const { currentUser } = useCorrectSupabase()

// Usuario mock para pruebas sin auth
const currentUser = ref({
  id: 'test-user',
  email: 'info@be-mindpower.net',
  name: 'Administrador',
  isAdmin: true,
  source: 'bypass-mode'
})
const { 
  getAllContacts, 
  getContactsStats, 
  isLoading: contactsLoading 
} = useSupabaseContacts()
const { 
  uploadFiles, 
  formatFileSize,
  uploadProgress,
  isLoading: storageLoading 
} = useSupabaseStorage()

// Estado principal del formulario
const emailData = reactive({
  sendType: 'single' as 'single' | 'mass',
  singleRecipient: '',
  selectedRecipients: [] as string[],
  subject: '',
  content: ''
})

// Estado de contactos
const allContacts = ref([])
const contactsFilter = ref('')
const contactsStats = ref({ total: 0 })

// Estado de archivos
const attachments = ref<Array<{
  file?: File
  fileName: string
  fileSize: number
  mimeType: string
  publicUrl?: string
  uploaded: boolean
  uploading: boolean
  error?: string
}>>([])

const isDragging = ref(false)
const allowedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.csv'

// Estado de UI
const showConfirmModal = ref(false)
const isSending = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// Computadas
const filteredContacts = computed(() => {
  if (!contactsFilter.value) return allContacts.value
  
  const filter = contactsFilter.value.toLowerCase()
  return allContacts.value.filter((contact: any) =>
    contact.email?.toLowerCase().includes(filter) ||
    contact.name?.toLowerCase().includes(filter)
  )
})

const canSendEmail = computed(() => {
  const hasRecipients = emailData.sendType === 'single' 
    ? emailData.singleRecipient.trim() !== ''
    : emailData.selectedRecipients.length > 0
  
  const hasSubject = emailData.subject.trim() !== ''
  const hasContent = emailData.content.trim() !== ''
  const allAttachmentsUploaded = attachments.value.every(a => a.uploaded || !a.file)
  
  return hasRecipients && hasSubject && hasContent && allAttachmentsUploaded && !isSending.value
})

// Funciones de contactos
const refreshContacts = async () => {
  try {
    const [contactsResult, statsResult] = await Promise.all([
      getAllContacts(),
      getContactsStats()
    ])
    
    if (contactsResult.success) {
      allContacts.value = contactsResult.contacts
    }
    
    if (statsResult.success) {
      contactsStats.value = { total: statsResult.total }
    }
  } catch (err) {
    console.error('Error cargando contactos:', err)
    showNotification('Error cargando contactos', 'error')
  }
}

const selectAllContacts = () => {
  emailData.selectedRecipients = filteredContacts.value.map((c: any) => c.email)
}

// Funciones de archivos
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
    target.value = '' // Reset input
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = async (files: File[]) => {
  const validFiles = files.filter(file => {
    // Verificar tamaño (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      showNotification(`${file.name} es demasiado grande (max 50MB)`, 'error')
      return false
    }
    
    // Verificar límite de archivos
    if (attachments.value.length >= 10) {
      showNotification('Máximo 10 archivos adjuntos', 'error')
      return false
    }
    
    return true
  })

  // Agregar archivos al estado
  for (const file of validFiles) {
    attachments.value.push({
      file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploaded: false,
      uploading: false
    })
  }

  // Subir archivos a Supabase Storage
  if (validFiles.length > 0) {
    await uploadAttachments(validFiles)
  }
}

const uploadAttachments = async (files: File[]) => {
  try {
    // Marcar archivos como subiendo
    files.forEach(file => {
      const attachment = attachments.value.find(a => a.fileName === file.name)
      if (attachment) {
        attachment.uploading = true
      }
    })

    const result = await uploadFiles(files, {
      bucket: 'email-attachments',
      path: `${currentUser.value?.id || 'anonymous'}/${Date.now()}`
    })

    // Actualizar estado de archivos
    result.results?.forEach((fileResult: any) => {
      const attachment = attachments.value.find(a => a.fileName === fileResult.file)
      if (attachment) {
        attachment.uploading = false
        if (fileResult.success) {
          attachment.uploaded = true
          attachment.publicUrl = fileResult.data?.publicUrl
        } else {
          attachment.error = fileResult.error
        }
      }
    })

    const successCount = result.results?.filter((r: any) => r.success).length || 0
    const errorCount = files.length - successCount

    if (successCount > 0) {
      showNotification(`${successCount} archivo(s) subido(s) exitosamente`, 'success')
    }
    
    if (errorCount > 0) {
      showNotification(`Error subiendo ${errorCount} archivo(s)`, 'error')
    }

  } catch (err) {
    console.error('Error subiendo archivos:', err)
    showNotification('Error subiendo archivos', 'error')
    
    // Marcar todos como error
    files.forEach(file => {
      const attachment = attachments.value.find(a => a.fileName === file.name)
      if (attachment) {
        attachment.uploading = false
        attachment.error = 'Error de subida'
      }
    })
  }
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

// Funciones de envío
const sendEmail = () => {
  if (!canSendEmail.value) return
  showConfirmModal.value = true
}

const confirmSendEmail = async () => {
  if (isSending.value) return
  
  isSending.value = true
  showConfirmModal.value = false

  try {
    const emailPayload = {
      sendType: emailData.sendType,
      recipients: emailData.sendType === 'single' 
        ? [emailData.singleRecipient]
        : emailData.selectedRecipients,
      subject: emailData.subject,
      content: emailData.content,
      attachments: attachments.value.filter(a => a.uploaded).map(a => ({
        fileName: a.fileName,
        publicUrl: a.publicUrl,
        mimeType: a.mimeType,
        fileSize: a.fileSize
      })),
      sender: currentUser.value?.email
    }

    const response = await $fetch('/api/emails/send-advanced', {
      method: 'POST',
      body: emailPayload
    })

    if (response.success) {
      showNotification(
        `Email ${emailData.sendType === 'mass' ? 'masivo' : ''} enviado exitosamente!`, 
        'success'
      )
      
      // Reset form
      emailData.subject = ''
      emailData.content = ''
      emailData.singleRecipient = ''
      emailData.selectedRecipients = []
      attachments.value = []
      
    } else {
      throw new Error(response.error || 'Error enviando email')
    }

  } catch (err: any) {
    console.error('Error enviando email:', err)
    showNotification(err.message || 'Error enviando email', 'error')
  } finally {
    isSending.value = false
  }
}

// Funciones de UI
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 5000)
}

// Lifecycle
onMounted(async () => {
  await refreshContacts()
  
  // Leer parámetros URL
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.get('to')) {
      const emailParam = urlParams.get('to') as string
      emailData.singleRecipient = emailParam
    }
    
    if (urlParams.get('subject')) {
      emailData.subject = urlParams.get('subject') as string
    }
    
    if (urlParams.get('body') || urlParams.get('content')) {
      const content = (urlParams.get('body') || urlParams.get('content')) as string
      emailData.content = content
    }
  }
})

// Drag events
const handleDragEnter = () => { isDragging.value = true }
const handleDragLeave = () => { isDragging.value = false }

// SEO
useSeoMeta({
  title: 'Componer Email - Mailer Be-Mindpower',
  description: 'Componer emails individuales o masivos con archivos adjuntos'
})
</script>

<style scoped>
/* Estilos personalizados si es necesario */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
