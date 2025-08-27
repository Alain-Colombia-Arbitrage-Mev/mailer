<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
          <div class="flex items-center">
            <button
              @click="$router.back()"
              class="mr-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Componer Email</h1>
              <p class="text-sm text-gray-500 mt-1 hidden sm:block">Envía emails personales con plantillas y adjuntos</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              @click="saveDraft"
              :disabled="saving"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <DocumentIcon class="h-4 w-4 mr-2" />
              {{ saving ? 'Guardando...' : 'Guardar Borrador' }}
            </button>
            <button
              @click="sendEmail"
              :disabled="!canSend || sending"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <PaperAirplaneIcon class="h-4 w-4 mr-2" />
              {{ sending ? 'Enviando...' : 'Enviar Email' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
        <!-- Formulario Principal -->
        <div class="xl:col-span-3">
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Detalles del Email</h2>
            </div>
            
            <div class="p-4 sm:p-6 space-y-6">
              <!-- Destinatarios -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Para *
                </label>
                <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <div
                    v-for="(recipient, index) in recipients"
                    :key="index"
                    class="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800"
                  >
                    {{ recipient }}
                    <button
                      @click="removeRecipient(index)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <XMarkIcon class="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    v-model="newRecipient"
                    @keydown.enter.prevent="addRecipient"
                    @keydown.comma.prevent="addRecipient"
                    @input="handleRecipientInput"
                    @paste="handlePaste"
                    type="email"
                    placeholder="Agregar email..."
                    class="flex-1 min-w-[200px] border-none outline-none focus:ring-0"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Separa múltiples emails con comas, espacios o presiona Enter. También puedes pegar una lista de emails.
                </p>
              </div>

              <!-- Asunto -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  id="subject"
                  v-model="emailData.subject"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Escribe el asunto del email..."
                />
              </div>

              <!-- Plantilla -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla
                </label>
                <select
                  v-model="selectedTemplate"
                  @change="loadTemplate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin plantilla (texto plano)</option>
                  <option
                    v-for="template in templates"
                    :key="template.id"
                    :value="template.id"
                  >
                    {{ template.name }}
                  </option>
                </select>
              </div>

              <!-- Editor de Contenido -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Contenido *
                </label>
                <div class="border border-gray-300 rounded-md">
                  <!-- Toolbar -->
                  <div class="flex items-center space-x-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                    <button
                      @click="toggleBold"
                      :class="{ 'bg-gray-200': isBold }"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      @click="toggleItalic"
                      :class="{ 'bg-gray-200': isItalic }"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      <em>I</em>
                    </button>
                    <button
                      @click="insertLink"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      🔗
                    </button>
                    <div class="border-l border-gray-300 h-6"></div>
                    <button
                      @click="toggleHtmlMode"
                      :class="{ 'bg-blue-100 text-blue-700': isHtmlMode }"
                      class="px-2 py-1 text-sm rounded hover:bg-gray-200"
                      type="button"
                    >
                      {{ isHtmlMode ? 'Visual' : 'HTML' }}
                    </button>
                  </div>
                  
                  <!-- Editor -->
                  <div class="relative">
                    <div
                      v-if="!isHtmlMode"
                      ref="editor"
                      contenteditable="true"
                      @input="updateContent"
                      @keydown="handleKeydown"
                      class="min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style="white-space: pre-wrap;"
                    ></div>
                    <textarea
                      v-else
                      v-model="emailData.content"
                      class="w-full min-h-[300px] p-4 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escribe tu HTML aquí..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Vista Previa -->
              <div v-if="emailData.content && isHtmlMode">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vista Previa
                </label>
                <div class="border border-gray-200 rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <div v-html="emailData.content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Adjuntos -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Adjuntos</h3>
            </div>
            <div class="p-4">
              <!-- Zona de Drop -->
              <div
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent
                :class="{
                  'border-blue-500 bg-blue-50': isDragging,
                  'border-gray-300': !isDragging
                }"
                class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                @click="$refs.fileInput.click()"
              >
                <CloudArrowUpIcon class="mx-auto h-8 w-8 text-gray-400" />
                <p class="mt-2 text-sm text-gray-600">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p class="text-xs text-gray-500 mt-1">
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

              <!-- Lista de Adjuntos -->
              <div v-if="attachments.length > 0" class="mt-4 space-y-2">
                <div
                  v-for="(attachment, index) in attachments"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div class="flex items-center space-x-2">
                    <DocumentIcon class="h-4 w-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ attachment.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ formatFileSize(attachment.size) }}
                      </p>
                    </div>
                  </div>
                  <button
                    @click="removeAttachment(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Plantillas Rápidas -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Plantillas Rápidas</h3>
            </div>
            <div class="p-4 space-y-2">
              <button
                v-for="template in quickTemplates"
                :key="template.id"
                @click="applyQuickTemplate(template)"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {{ template.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Confirmar Envío</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              ¿Estás seguro de que deseas enviar este email a {{ recipients.length }} destinatario(s)?
            </p>
            <div class="mt-4 text-left bg-gray-50 p-3 rounded">
              <p class="text-xs text-gray-600"><strong>Para:</strong> {{ recipients.join(', ') }}</p>
              <p class="text-xs text-gray-600 mt-1"><strong>Asunto:</strong> {{ emailData.subject }}</p>
              <p class="text-xs text-gray-600 mt-1"><strong>Adjuntos:</strong> {{ attachments.length }}</p>
            </div>
          </div>
          <div class="items-center px-4 py-3">
            <div class="flex space-x-3">
              <button
                @click="showConfirmModal = false"
                class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                @click="confirmSend"
                class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Enviar
              </button>
            </div>
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
  CheckIcon
} from '@heroicons/vue/24/outline'

// Middleware temporalmente desactivado
// definePageMeta({ middleware: 'auth' })

// Composables
const { user } = useSupabaseMaster()
const { uploadFile } = useFileUpload()

// Estado del formulario
const emailData = reactive({
  subject: '',
  content: '',
  isHtml: false
})

const recipients = ref<string[]>([])
const newRecipient = ref('')
const attachments = ref<File[]>([])
const selectedTemplate = ref('')
const templates = ref([])
const quickTemplates = ref([
  { id: 'welcome', name: 'Bienvenida', content: '<h2>¡Bienvenido!</h2><p>Gracias por unirte a nosotros.</p>' },
  { id: 'followup', name: 'Seguimiento', content: '<h2>Seguimiento</h2><p>Esperamos tu respuesta.</p>' },
  { id: 'newsletter', name: 'Newsletter', content: '<h2>Newsletter</h2><p>Las últimas noticias para ti.</p>' }
])

// Estado del editor
const isHtmlMode = ref(false)
const isBold = ref(false)
const isItalic = ref(false)
const editor = ref<HTMLElement>()

// Estado de la UI
const loading = ref(false)
const saving = ref(false)
const sending = ref(false)
const isDragging = ref(false)
const showConfirmModal = ref(false)

// Computed
const canSend = computed(() => {
  return recipients.value.length > 0 && 
         emailData.subject.trim() && 
         emailData.content.trim() && 
         !sending.value
})

// Métodos para destinatarios
const addRecipient = () => {
  const input = newRecipient.value.trim()
  if (!input) return
  
  // Dividir por comas y procesar cada email
  const emails = input.split(',').map(email => email.trim()).filter(email => email)
  
  emails.forEach(email => {
    if (isValidEmail(email) && !recipients.value.includes(email)) {
      recipients.value.push(email)
      console.log('✅ Email agregado:', email)
    } else if (!isValidEmail(email)) {
      console.warn('❌ Email inválido:', email)
    } else if (recipients.value.includes(email)) {
      console.warn('⚠️ Email duplicado:', email)
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

// Manejar input en tiempo real para detectar comas
const handleRecipientInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Si el valor contiene una coma, procesar inmediatamente
  if (value.includes(',')) {
    // Pequeño delay para que Vue actualice el v-model
    nextTick(() => {
      addRecipient()
    })
  }
}

// Manejar pegado de múltiples emails
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') || ''
  
  if (pastedText.trim()) {
    // Agregar el texto pegado al input actual
    newRecipient.value = (newRecipient.value + pastedText).trim()
    
    // Procesar inmediatamente si contiene comas o espacios
    if (pastedText.includes(',') || pastedText.includes(' ') || pastedText.includes(';')) {
      nextTick(() => {
        // Reemplazar separadores comunes con comas
        newRecipient.value = newRecipient.value
          .replace(/[;\s]+/g, ',')
          .replace(/,+/g, ',')
        addRecipient()
      })
    }
  }
}

// Métodos del editor
const toggleHtmlMode = () => {
  if (isHtmlMode.value) {
    // Cambiar de HTML a visual
    if (editor.value) {
      editor.value.innerHTML = emailData.content
    }
  } else {
    // Cambiar de visual a HTML
    if (editor.value) {
      emailData.content = editor.value.innerHTML
    }
  }
  isHtmlMode.value = !isHtmlMode.value
}

const updateContent = () => {
  if (editor.value && !isHtmlMode.value) {
    emailData.content = editor.value.innerHTML
  }
}

const toggleBold = () => {
  document.execCommand('bold')
  isBold.value = document.queryCommandState('bold')
}

const toggleItalic = () => {
  document.execCommand('italic')
  isItalic.value = document.queryCommandState('italic')
}

const insertLink = () => {
  const url = prompt('Ingresa la URL:')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Actualizar estado de botones
  setTimeout(() => {
    isBold.value = document.queryCommandState('bold')
    isItalic.value = document.queryCommandState('italic')
  }, 10)
}

// Métodos de archivos
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
}

const addFiles = (files: File[]) => {
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert(`El archivo ${file.name} es demasiado grande (máximo 10MB)`)
      continue
    }
    
    if (!attachments.value.find(f => f.name === file.name)) {
      attachments.value.push(file)
    }
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

// Métodos de plantillas
const loadTemplate = async () => {
  if (!selectedTemplate.value) {
    emailData.content = ''
    return
  }
  
  // Aquí cargarías la plantilla desde la base de datos
  // Por ahora, simulamos con plantillas locales
  const template = quickTemplates.value.find(t => t.id === selectedTemplate.value)
  if (template) {
    emailData.content = template.content
    emailData.isHtml = true
    isHtmlMode.value = true
    
    if (editor.value) {
      editor.value.innerHTML = template.content
    }
  }
}

const applyQuickTemplate = (template: any) => {
  emailData.content = template.content
  emailData.isHtml = true
  isHtmlMode.value = true
  
  if (editor.value) {
    editor.value.innerHTML = template.content
  }
}

// Métodos principales
const saveDraft = async () => {
  saving.value = true
  try {
    // Aquí guardarías el borrador en la base de datos
    console.log('Guardando borrador...', {
      recipients: recipients.value,
      subject: emailData.subject,
      content: emailData.content,
      attachments: attachments.value.map(f => f.name)
    })
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mostrar notificación de éxito
    alert('Borrador guardado exitosamente')
  } catch (error) {
    console.error('Error guardando borrador:', error)
    alert('Error al guardar el borrador')
  } finally {
    saving.value = false
  }
}

const sendEmail = () => {
  if (!canSend.value) return
  showConfirmModal.value = true
}

const confirmSend = async () => {
  showConfirmModal.value = false
  sending.value = true
  
  try {
    console.log('Enviando email...', {
      recipients: recipients.value,
      subject: emailData.subject,
      content: emailData.content,
      attachments: attachments.value.length
    })

    let response

    // Decidir qué endpoint usar basado en si hay adjuntos
    if (attachments.value.length > 0) {
      console.log('📎 Enviando con adjuntos usando FormData...')
      
      // Crear FormData para enviar archivos
      const formData = new FormData()
      formData.append('recipients', JSON.stringify(recipients.value))
      formData.append('subject', emailData.subject)
      formData.append('content', emailData.content)
      formData.append('isHtml', String(emailData.isHtml || isHtmlMode.value))
      formData.append('sender', user.value?.email || 'info@be-mindpower.net')
      
      // Agregar archivos adjuntos
      attachments.value.forEach((file, index) => {
        formData.append(`attachment_${index}`, file)
        console.log(`📎 Agregando adjunto: ${file.name}`)
      })

      response = await $fetch('/api/emails/send-with-files', {
        method: 'POST',
        body: formData
      })
    } else {
      console.log('📧 Enviando sin adjuntos...')
      
      // Enviar sin adjuntos usando JSON
      const emailPayload = {
        recipients: recipients.value,
        subject: emailData.subject,
        content: emailData.content,
        isHtml: emailData.isHtml || isHtmlMode.value,
        attachments: [],
        sender: user.value?.email || 'info@be-mindpower.net'
      }

      response = await $fetch('/api/emails/send', {
        method: 'POST',
        body: emailPayload
      })
    }

    if (response.success) {
      alert('Email enviado exitosamente')
      // Limpiar formulario
      recipients.value = []
      emailData.subject = ''
      emailData.content = ''
      attachments.value = []
      if (editor.value) {
        editor.value.innerHTML = ''
      }
    } else {
      throw new Error(response.error || 'Error desconocido')
    }
  } catch (error: any) {
    console.error('Error enviando email:', error)
    alert(`Error al enviar el email: ${error.message}`)
  } finally {
    sending.value = false
  }
}

// Eventos de drag
onMounted(() => {
  // Prevenir comportamiento por defecto del drag en toda la página
  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', (e) => e.preventDefault())
  
  // Leer parámetros URL para prellenar destinatarios
  const route = useRoute()
  if (route.query.to) {
    const emailParam = route.query.to as string
    const nameParam = route.query.name as string
    
    console.log('📧 Parámetros URL detectados:', { email: emailParam, name: nameParam })
    
    // Manejar múltiples emails separados por coma
    const emails = emailParam.split(',').map(email => email.trim()).filter(email => email)
    
    for (const email of emails) {
      if (!recipients.value.includes(email)) {
        recipients.value.push(email)
        console.log('✅ Destinatario agregado desde URL:', email)
      }
    }
    
    // Si hay un nombre específico y solo un email, podríamos usarlo para mostrar en la UI
    if (nameParam && emails.length === 1) {
      console.log('📝 Nombre del destinatario:', nameParam)
    }
  }
  
  // Leer otros parámetros URL opcionales
  if (route.query.subject) {
    emailData.subject = route.query.subject as string
    console.log('📝 Asunto prellenado desde URL:', emailData.subject)
  }
  
  if (route.query.body || route.query.content) {
    const content = (route.query.body || route.query.content) as string
    emailData.content = content
    if (editor.value) {
      editor.value.innerHTML = content
    }
    console.log('📝 Contenido prellenado desde URL')
  }
  
  // Inicializar editor
  if (editor.value) {
    editor.value.innerHTML = emailData.content
  }
})

// Detectar drag
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}
</script>
