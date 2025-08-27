<template>
  <NuxtLayout name="default">
    <div>
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Componer Email</h1>
          <p class="mt-2 text-gray-600">Crea y envía emails personalizados a tus contactos</p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button 
            @click="saveDraft"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            {{ saving ? 'Guardando...' : 'Guardar Borrador' }}
          </button>
          <button 
            @click="sendEmail"
            :disabled="!canSend || sending"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            {{ sending ? 'Enviando...' : 'Enviar Email' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Compose Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Recipients Section -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Destinatarios</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Para:</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="recipient in recipients" 
                    :key="recipient"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {{ recipient }}
                    <button 
                      @click="removeRecipient(recipient)" 
                      class="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </span>
                </div>
                <div class="flex space-x-2">
                  <input 
                    v-model="newRecipient"
                    type="email"
                    placeholder="Agregar email..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @keypress.enter="addRecipient"
                  />
                  <button 
                    @click="addRecipient"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                  <button 
                    @click="showContactSelector = true"
                    class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                  >
                    Seleccionar Contactos
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">CC:</label>
                  <input 
                    v-model="emailData.cc"
                    type="email"
                    placeholder="Emails separados por comas"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">BCC:</label>
                  <input 
                    v-model="emailData.bcc"
                    type="email"
                    placeholder="Emails separados por comas"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Email Content -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contenido del Email</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Asunto:</label>
                <input 
                  v-model="emailData.subject"
                  type="text"
                  required
                  placeholder="Escribe el asunto del email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje:</label>
                <div class="border border-gray-300 rounded-md">
                  <div class="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2">
                    <button 
                      @click="toggleFormat('bold')"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 5a1 1 0 011-1h5.5a2.5 2.5 0 010 5H4v2h5.5a2.5 2.5 0 010 5H4a1 1 0 01-1-1V5z"/>
                      </svg>
                    </button>
                    <button 
                      @click="toggleFormat('italic')"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.25 3.75H12a.75.75 0 010 1.5h-1.136l-2.727 10.5H9.75a.75.75 0 010 1.5H6a.75.75 0 010-1.5h1.136L9.863 5.25H8.25a.75.75 0 010-1.5z"/>
                      </svg>
                    </button>
                    <button 
                      @click="toggleFormat('underline')"
                      class="p-1 rounded hover:bg-gray-200"
                      type="button"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 19a1 1 0 100-2h14a1 1 0 100 2H3zM6.5 4.5a1 1 0 00-2 0v5a4.5 4.5 0 009 0v-5a1 1 0 00-2 0v5a2.5 2.5 0 01-5 0v-5z"/>
                      </svg>
                    </button>
                    <div class="border-l border-gray-300 h-4 mx-2"></div>
                    <button 
                      @click="insertVariable('firstName')"
                      class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      type="button"
                    >
                      {{firstName}}
                    </button>
                    <button 
                      @click="insertVariable('lastName')"
                      class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      type="button"
                    >
                      {{lastName}}
                    </button>
                    <button 
                      @click="insertVariable('email')"
                      class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      type="button"
                    >
                      {{email}}
                    </button>
                  </div>
                  <textarea 
                    v-model="emailData.content"
                    ref="contentEditor"
                    rows="12"
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    class="w-full px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-0"
                  ></textarea>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Puedes usar variables como {{firstName}}, {{lastName}}, {{email}} para personalizar el mensaje
                </p>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Archivos Adjuntos</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500">
                      <span class="font-semibold">Click para subir</span> o arrastra archivos aquí
                    </p>
                    <p class="text-xs text-gray-500">PNG, JPG, PDF, DOC (MAX. 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    class="hidden" 
                    multiple 
                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt"
                    @change="handleFileUpload"
                  />
                </label>
              </div>
              
              <div v-if="attachments.length > 0" class="space-y-2">
                <div 
                  v-for="(file, index) in attachments" 
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm text-gray-700">{{ file.name }} ({{ formatFileSize(file.size) }})</span>
                  </div>
                  <button 
                    @click="removeAttachment(index)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Email Preview -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
            <div class="space-y-3 text-sm">
              <div>
                <span class="font-medium text-gray-600">Para:</span>
                <span class="text-gray-900">{{ recipients.length }} destinatario(s)</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Asunto:</span>
                <span class="text-gray-900">{{ emailData.subject || 'Sin asunto' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Archivos:</span>
                <span class="text-gray-900">{{ attachments.length }} archivo(s)</span>
              </div>
            </div>
          </div>

          <!-- Templates -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Plantillas</h3>
            <div class="space-y-2">
              <button 
                v-for="template in templates" 
                :key="template.id"
                @click="loadTemplate(template)"
                class="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div class="font-medium text-gray-900">{{ template.name }}</div>
                <div class="text-sm text-gray-600 truncate">{{ template.subject }}</div>
              </button>
              <NuxtLink 
                to="/templates"
                class="block w-full text-center p-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas las plantillas →
              </NuxtLink>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Emails enviados hoy:</span>
                <span class="font-medium text-gray-900">{{ stats.todayEmails }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total contactos:</span>
                <span class="font-medium text-gray-900">{{ stats.totalContacts }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tasa de apertura:</span>
                <span class="font-medium text-gray-900">{{ stats.openRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Selector Modal -->
    <div v-if="showContactSelector" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Seleccionar Contactos</h3>
          
          <div class="max-h-96 overflow-y-auto">
            <div class="space-y-2">
              <div 
                v-for="contact in contacts" 
                :key="contact.idPerson"
                class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <input 
                  type="checkbox"
                  :id="`contact-${contact.idPerson}`"
                  :value="contact.email"
                  v-model="selectedContacts"
                  class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="`contact-${contact.idPerson}`" class="flex-1 cursor-pointer">
                  <div class="font-medium text-gray-900">{{ contact.firstName }} {{ contact.lastName }}</div>
                  <div class="text-sm text-gray-600">{{ contact.email }}</div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              @click="showContactSelector = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button 
              @click="addSelectedContacts"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Agregar Seleccionados ({{ selectedContacts.length }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// Define page meta with middleware
definePageMeta({
  middleware: 'auth'
})

// Reactive data
const recipients = ref([])
const newRecipient = ref('')
const attachments = ref([])
const sending = ref(false)
const saving = ref(false)
const showContactSelector = ref(false)
const selectedContacts = ref([])
const contacts = ref([])
const templates = ref([])
const contentEditor = ref(null)

// Email data
const emailData = ref({
  subject: '',
  content: '',
  cc: '',
  bcc: ''
})

// Stats
const stats = ref({
  todayEmails: 0,
  totalContacts: 0,
  openRate: 0
})

// Computed
const canSend = computed(() => {
  return recipients.value.length > 0 && emailData.value.subject && emailData.value.content
})

// Methods
const addRecipient = () => {
  if (newRecipient.value && !recipients.value.includes(newRecipient.value)) {
    recipients.value.push(newRecipient.value)
    newRecipient.value = ''
  }
}

const removeRecipient = (email) => {
  recipients.value = recipients.value.filter(r => r !== email)
}

const addSelectedContacts = () => {
  selectedContacts.value.forEach(email => {
    if (!recipients.value.includes(email)) {
      recipients.value.push(email)
    }
  })
  selectedContacts.value = []
  showContactSelector.value = false
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
      attachments.value.push(file)
    } else {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`)
    }
  })
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const toggleFormat = (format) => {
  document.execCommand(format, false, null)
}

const insertVariable = (variable) => {
  if (contentEditor.value) {
    const cursorPos = contentEditor.value.selectionStart
    const textBefore = emailData.value.content.substring(0, cursorPos)
    const textAfter = emailData.value.content.substring(cursorPos)
    emailData.value.content = textBefore + `{{${variable}}}` + textAfter
    
    // Set cursor position after the inserted variable
    nextTick(() => {
      contentEditor.value.setSelectionRange(cursorPos + variable.length + 4, cursorPos + variable.length + 4)
      contentEditor.value.focus()
    })
  }
}

const loadTemplate = (template) => {
  emailData.value.subject = template.subject
  emailData.value.content = template.html_content || template.text_content || ''
}

const sendEmail = async () => {
  if (!canSend.value) return

  try {
    sending.value = true

    // Prepare form data for file uploads
    const formData = new FormData()
    formData.append('recipients', JSON.stringify(recipients.value))
    formData.append('subject', emailData.value.subject)
    formData.append('content', emailData.value.content)
    formData.append('cc', emailData.value.cc)
    formData.append('bcc', emailData.value.bcc)

    // Add attachments
    attachments.value.forEach((file, index) => {
      formData.append(`attachment_${index}`, file)
    })

    const response = await $fetch('/api/emails/send', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      alert('¡Email enviado exitosamente!')
      // Reset form
      recipients.value = []
      emailData.value = { subject: '', content: '', cc: '', bcc: '' }
      attachments.value = []
    } else {
      throw new Error(response.message || 'Error al enviar email')
    }

  } catch (error) {
    console.error('Error sending email:', error)
    alert('Error al enviar el email: ' + error.message)
  } finally {
    sending.value = false
  }
}

const saveDraft = async () => {
  try {
    saving.value = true
    // Implementation for saving draft
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    alert('Borrador guardado exitosamente')
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Error al guardar borrador')
  } finally {
    saving.value = false
  }
}

const loadContacts = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('USERS')
      .select('idPerson, firstName, lastName, email')
      .limit(100)
    
    if (error) {
      console.error('Error loading contacts:', error)
      return
    }
    
    contacts.value = data || []
  } catch (error) {
    console.error('Error:', error)
  }
}

const loadTemplates = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { data, error } = await supabase
      .from('email_templates')
      .select('id, name, subject, html_content, text_content')
      .eq('is_active', true)
      .limit(5)
    
    if (error) {
      console.error('Error loading templates:', error)
      return
    }
    
    templates.value = data || []
  } catch (error) {
    console.error('Error:', error)
  }
}

const loadStats = async () => {
  try {
    // Mock stats for now
    stats.value = {
      todayEmails: 12,
      totalContacts: contacts.value.length,
      openRate: 68.5
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(() => {
  loadContacts()
  loadTemplates()
  loadStats()
})

// Set page title
useHead({
  title: 'Componer Email - MailPower'
})
</script>
