<template>
  <NuxtLayout name="default">
    <div>
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Plantillas de Email</h1>
          <p class="mt-2 text-gray-600">Crea y gestiona plantillas reutilizables para tus campañas</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <NuxtLink 
            to="/templates/new"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva Plantilla
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total Plantillas</p>
              <p class="text-xl font-semibold text-gray-900">{{ templates.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Activas</p>
              <p class="text-xl font-semibold text-gray-900">{{ activeTemplates }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Creadas Este Mes</p>
              <p class="text-xl font-semibold text-gray-900">{{ monthlyTemplates }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Más Usada</p>
              <p class="text-xl font-semibold text-gray-900">{{ mostUsedTemplate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando plantillas...
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar plantillas</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="loadTemplates"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="templates.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Sin plantillas</h3>
        <p class="text-gray-600 mb-4">No tienes plantillas creadas aún. ¡Crea tu primera plantilla!</p>
        <NuxtLink 
          to="/templates/new"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Crear Primera Plantilla
        </NuxtLink>
      </div>

      <!-- Templates Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="template in templates" 
          :key="template.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Template Preview/Thumbnail -->
          <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
            <div v-if="template.thumbnail_url" class="w-full h-full rounded overflow-hidden">
              <img 
                :src="template.thumbnail_url" 
                :alt="template.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-sm text-gray-500">Vista previa no disponible</p>
            </div>
          </div>
          
          <!-- Template Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">{{ template.name }}</h3>
              <span 
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="template.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'"
              >
                {{ template.is_active ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ template.subject }}</p>
            
            <div class="text-xs text-gray-500 mb-4">
              <span>Creada: {{ formatDate(template.created_at) }}</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button 
                @click="previewTemplate(template)"
                class="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                Vista previa
              </button>
              <button 
                @click="useAsCompose(template)"
                class="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Usar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Vista previa: {{ selectedTemplate?.name }}
          </h3>
          <button 
            @click="showPreview = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Email Header -->
          <div class="bg-gray-50 p-4 border-b border-gray-200">
            <div class="space-y-2 text-sm">
              <div><strong>Asunto:</strong> {{ selectedTemplate?.subject }}</div>
              <div><strong>De:</strong> info@be-mindpower.net</div>
              <div><strong>Para:</strong> usuario@ejemplo.com</div>
            </div>
          </div>
          
          <!-- Email Content -->
          <div class="p-6 max-h-96 overflow-y-auto">
            <div 
              v-if="selectedTemplate?.html_content"
              v-html="selectedTemplate.html_content"
              class="prose max-w-none"
            ></div>
            <div 
              v-else-if="selectedTemplate?.text_content"
              class="whitespace-pre-wrap text-gray-900"
            >
              {{ selectedTemplate.text_content }}
            </div>
            <div v-else class="text-gray-500 italic">
              Sin contenido para mostrar
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-4">
          <button 
            @click="showPreview = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cerrar
          </button>
          <button 
            @click="useAsCompose(selectedTemplate)"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Usar en nuevo email
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Check authentication
onMounted(() => {
  if (process.client) {
    const storedUser = localStorage.getItem('mailpower_user')
    if (!storedUser) {
      navigateTo('/login')
      return
    }
  }
})

// Reactive data
const templates = ref([])
const loading = ref(true)
const error = ref('')
const showPreview = ref(false)
const selectedTemplate = ref(null)

// Computed properties
const activeTemplates = computed(() => templates.value.filter(t => t.is_active).length)
const monthlyTemplates = computed(() => {
  const currentMonth = new Date().getMonth()
  return templates.value.filter(t => new Date(t.created_at).getMonth() === currentMonth).length
})
const mostUsedTemplate = computed(() => {
  if (templates.value.length === 0) return 'N/A'
  const mostUsed = templates.value.reduce((prev, current) => {
    return (current.usage_count || 0) > (prev.usage_count || 0) ? current : prev
  }, templates.value[0])
  return mostUsed?.name || 'N/A'
})

// Methods
const loadTemplates = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()

    const { data, error: supabaseError } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) {
      console.error('Error loading templates:', supabaseError)
      error.value = 'Error al cargar las plantillas: ' + supabaseError.message
      return
    }

    templates.value = data || []
    
    // Si no hay plantillas, crear algunas por defecto
    if (templates.value.length === 0) {
      await createDefaultTemplates()
    }

  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error de conexión. Verifica tu configuración de Supabase.'
    templates.value = []
  } finally {
    loading.value = false
  }
}

// Create default templates if none exist
const createDefaultTemplates = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()

    const defaultTemplates = [
      {
        name: 'Email de Bienvenida',
        subject: '¡Bienvenido a MailPower!',
        html_content: `
          <h2>¡Hola {{firstName}}!</h2>
          <p>Te damos la bienvenida a MailPower, tu nueva plataforma de email marketing.</p>
          <p>Estamos emocionados de tenerte con nosotros.</p>
          <p>Saludos,<br>El equipo de MailPower</p>
        `,
        text_content: '¡Hola {{firstName}}!\n\nTe damos la bienvenida a MailPower, tu nueva plataforma de email marketing.\n\nEstamos emocionados de tenerte con nosotros.\n\nSaludos,\nEl equipo de MailPower',
        is_active: true
      },
      {
        name: 'Newsletter Mensual',
        subject: 'Newsletter - Novedades del mes',
        html_content: `
          <h2>Novedades de este mes</h2>
          <p>Hola {{firstName}},</p>
          <p>Te contamos las últimas novedades y actualizaciones.</p>
          <ul>
            <li>Nueva funcionalidad 1</li>
            <li>Mejora en el sistema</li>
            <li>Próximos eventos</li>
          </ul>
          <p>¡Hasta la próxima!</p>
        `,
        text_content: 'Hola {{firstName}},\n\nTe contamos las últimas novedades y actualizaciones.\n\n- Nueva funcionalidad 1\n- Mejora en el sistema\n- Próximos eventos\n\n¡Hasta la próxima!',
        is_active: true
      }
    ]

    const { data, error: insertError } = await supabase
      .from('email_templates')
      .insert(defaultTemplates)
      .select()

    if (!insertError && data) {
      templates.value = data
    }
  } catch (err) {
    console.error('Error creating default templates:', err)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const previewTemplate = (template) => {
  selectedTemplate.value = template
  showPreview.value = true
}

const useAsCompose = (template) => {
  // Navigate to compose with template data
  const templateData = {
    subject: template.subject,
    content: template.html_content || template.text_content
  }
  
  navigateTo({
    path: '/emails/compose',
    query: { template: JSON.stringify(templateData) }
  })
  
  showPreview.value = false
}

onMounted(() => {
  loadTemplates()
})

// Set page title
useHead({
  title: 'Plantillas - MailPower'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
