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
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ isEditing ? 'Editar Plantilla' : 'Nueva Plantilla HTML' }}
              </h1>
              <p class="text-sm text-gray-500 mt-1 hidden sm:block">
                Diseña plantillas HTML reutilizables para tus campañas de email
              </p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              @click="previewTemplate"
              :disabled="!templateData.html_content"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <EyeIcon class="h-4 w-4 mr-2" />
              Vista Previa
            </button>
            <button
              @click="saveTemplate"
              :disabled="!canSave || saving"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <DocumentCheckIcon class="h-4 w-4 mr-2" />
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar Plantilla') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- Editor Principal -->
        <div class="xl:col-span-2">
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Editor de Plantilla</h2>
            </div>
            
            <div class="p-4 sm:p-6 space-y-6">
              <!-- Información Básica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Plantilla *
                  </label>
                  <input
                    v-model="templateData.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Newsletter Mensual"
                  />
                </div>
                
                <!-- Campo eliminado: category no existe en el esquema real -->
              </div>

              <!-- Asunto -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Asunto por Defecto
                </label>
                <input
                  v-model="templateData.subject"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Asunto del email (puede incluir variables como {{nombre}})"
                />
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="templateData.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción breve de la plantilla..."
                ></textarea>
              </div>

              <!-- Editor HTML -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Contenido HTML *
                  </label>
                  <div class="flex space-x-2">
                    <button
                      @click="insertVariable"
                      class="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Insertar Variable
                    </button>
                    <button
                      @click="loadPresetTemplate"
                      class="text-sm text-green-600 hover:text-green-800"
                    >
                      Plantilla Base
                    </button>
                  </div>
                </div>
                
                <!-- Toolbar -->
                <div class="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-2">
                  <button
                    @click="formatText('bold')"
                    class="p-1 rounded hover:bg-gray-200 text-sm font-bold"
                    type="button"
                  >
                    B
                  </button>
                  <button
                    @click="formatText('italic')"
                    class="p-1 rounded hover:bg-gray-200 text-sm italic"
                    type="button"
                  >
                    I
                  </button>
                  <button
                    @click="formatText('underline')"
                    class="p-1 rounded hover:bg-gray-200 text-sm underline"
                    type="button"
                  >
                    U
                  </button>
                  <div class="border-l border-gray-300 h-6 mx-2"></div>
                  <button
                    @click="insertLink"
                    class="p-1 rounded hover:bg-gray-200 text-sm"
                    type="button"
                  >
                    🔗
                  </button>
                  <button
                    @click="insertImage"
                    class="p-1 rounded hover:bg-gray-200 text-sm"
                    type="button"
                  >
                    🖼️
                  </button>
                  <div class="border-l border-gray-300 h-6 mx-2"></div>
                  <button
                    @click="toggleMode"
                    :class="{ 'bg-blue-100 text-blue-700': isCodeMode }"
                    class="px-2 py-1 text-sm rounded hover:bg-gray-200"
                    type="button"
                  >
                    {{ isCodeMode ? 'Visual' : 'Código' }}
                  </button>
                </div>
                
                <!-- Editor -->
                <div class="relative border-l border-r border-b border-gray-300 rounded-b-lg">
                  <div
                    v-if="!isCodeMode"
                    ref="visualEditor"
                    contenteditable="true"
                    @input="updateContent"
                    @keydown="handleKeydown"
                    class="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    style="white-space: pre-wrap;"
                    v-html="templateData.html_content"
                  ></div>
                  <textarea
                    v-else
                    v-model="templateData.html_content"
                    class="w-full min-h-[400px] p-4 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Escribe tu HTML aquí..."
                  ></textarea>
                </div>
              </div>

              <!-- Variables Disponibles -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Variables Disponibles</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <span
                    v-for="variable in availableVariables"
                    :key="variable.key"
                    @click="insertVariableIntoEditor(variable.key)"
                    class="bg-white px-2 py-1 rounded border cursor-pointer hover:bg-blue-100 transition-colors"
                    :title="variable.description"
                  >
                    {{ variable.key }}
                  </span>
                </div>
                <p class="text-xs text-blue-700 mt-2">
                  Haz clic en una variable para insertarla en el editor
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel Lateral -->
        <div class="xl:col-span-1 space-y-6">
          <!-- Vista Previa -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Vista Previa</h3>
            </div>
            <div class="p-4">
              <div 
                v-if="templateData.html_content"
                class="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto text-xs"
                v-html="previewContent"
              ></div>
              <div v-else class="text-center text-gray-500 py-8">
                <DocumentTextIcon class="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">La vista previa aparecerá aquí</p>
              </div>
            </div>
          </div>

          <!-- Plantillas Predefinidas -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Plantillas Base</h3>
            </div>
            <div class="p-4 space-y-2">
              <button
                v-for="preset in presetTemplates"
                :key="preset.id"
                @click="loadPreset(preset)"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <div class="font-medium">{{ preset.name }}</div>
                <div class="text-xs text-gray-500">{{ preset.description }}</div>
              </button>
            </div>
          </div>

          <!-- Configuración -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <div class="px-4 py-3 border-b border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900">Configuración</h3>
            </div>
            <div class="p-4 space-y-4">
              <label class="flex items-center">
                <input
                  v-model="templateData.is_active"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Plantilla activa</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="templateData.is_default"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Plantilla por defecto</span>
              </label>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <input
                  v-model="templateData.tags"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="newsletter, promocional"
                />
                <p class="text-xs text-gray-500 mt-1">Separar con comas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Vista Previa -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Vista Previa de la Plantilla</h3>
          <button
            @click="showPreviewModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div class="border border-gray-200 rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
          <div v-html="previewContent"></div>
        </div>
        
        <div class="flex justify-end mt-4">
          <button
            @click="showPreviewModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  EyeIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Proteger la ruta
definePageMeta({ middleware: 'auth' })

// Composables
const route = useRoute()
const { supabase } = useSupabaseMaster()

// Estado
const isEditing = computed(() => !!route.query.id)
const templateId = computed(() => route.query.id as string)

const templateData = reactive({
  name: '',
  subject: '',
  html_content: '<h1>Mi Plantilla</h1>\n<p>Hola {{nombre}},</p>\n<p>Este es el contenido de tu email.</p>\n<p>Saludos,<br>El equipo</p>', // Contenido inicial
  text_content: '',
  is_active: true
})

const saving = ref(false)
const isCodeMode = ref(true)
const showPreviewModal = ref(false)
const visualEditor = ref<HTMLElement>()

// Computed
const canSave = computed(() => {
  return templateData.name.trim() && templateData.html_content.trim()
})

const previewContent = computed(() => {
  if (!templateData.html_content) return ''
  
  // Reemplazar variables con valores de ejemplo
  let content = templateData.html_content
  availableVariables.forEach(variable => {
    const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g')
    content = content.replace(regex, variable.example)
  })
  
  return content
})

// Variables disponibles
const availableVariables = [
  { key: '{{nombre}}', description: 'Nombre del contacto', example: 'Juan Pérez' },
  { key: '{{apellido}}', description: 'Apellido del contacto', example: 'García' },
  { key: '{{email}}', description: 'Email del contacto', example: 'juan@ejemplo.com' },
  { key: '{{empresa}}', description: 'Empresa del contacto', example: 'Mi Empresa' },
  { key: '{{fecha}}', description: 'Fecha actual', example: new Date().toLocaleDateString('es-ES') },
  { key: '{{unsubscribe_url}}', description: 'URL de desuscripción', example: '#unsubscribe' },
  { key: '{{company_name}}', description: 'Nombre de tu empresa', example: 'Be-Mindpower' },
  { key: '{{company_address}}', description: 'Dirección de tu empresa', example: 'Calle Principal 123' }
]

// Plantillas predefinidas
const presetTemplates = [
  {
    id: 'basic',
    name: 'Básica',
    description: 'Plantilla simple y limpia',
    content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">¡Hola {{nombre}}!</h1>
        
        <p>Este es el contenido de tu email.</p>
        
        <div style="margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Botón de Acción</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280;">
            {{company_name}}<br>
            {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </div>
</body>
</html>`
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Para boletines informativos',
    content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <header style="background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Newsletter {{company_name}}</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.8;">{{fecha}}</p>
    </header>
    
    <main style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1f2937; margin-top: 0;">¡Hola {{nombre}}!</h2>
        
        <p>Aquí tienes las últimas noticias y actualizaciones:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Artículo Destacado</h3>
            <p>Descripción del artículo principal...</p>
            <a href="#" style="color: #2563eb; text-decoration: none;">Leer más →</a>
        </div>
        
        <h3 style="color: #374151;">Otras Noticias</h3>
        <ul style="padding-left: 20px;">
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 1</a></li>
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 2</a></li>
            <li style="margin-bottom: 10px;"><a href="#" style="color: #2563eb; text-decoration: none;">Noticia 3</a></li>
        </ul>
    </main>
    
    <footer style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
            {{company_name}} | {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </footer>
</body>
</html>`
  },
  {
    id: 'promotional',
    name: 'Promocional',
    description: 'Para ofertas y promociones',
    content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">¡Oferta Especial!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Solo para ti, {{nombre}}</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                50% DE DESCUENTO
            </div>
            <p style="font-size: 18px; margin: 0;">En todos nuestros productos</p>
        </div>
        
        <p>¡Hola {{nombre}}!</p>
        <p>Tenemos una oferta increíble solo para ti. Por tiempo limitado, obtén un 50% de descuento en toda nuestra colección.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">¡COMPRAR AHORA!</a>
        </div>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="margin: 0; color: #dc2626; font-weight: bold;">⏰ Oferta válida hasta el 31 de diciembre</p>
        </div>
    </div>
    
    <footer style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
            {{company_name}} | {{company_address}}<br>
            <a href="{{unsubscribe_url}}" style="color: #6b7280;">Desuscribirse</a>
        </p>
    </footer>
</body>
</html>`
  }
]

// Métodos del editor
const toggleMode = () => {
  if (isCodeMode.value) {
    // Cambiar de código a visual
    if (visualEditor.value) {
      visualEditor.value.innerHTML = templateData.html_content
    }
  } else {
    // Cambiar de visual a código
    if (visualEditor.value) {
      templateData.html_content = visualEditor.value.innerHTML
    }
  }
  isCodeMode.value = !isCodeMode.value
}

const updateContent = () => {
  if (visualEditor.value && !isCodeMode.value) {
    templateData.html_content = visualEditor.value.innerHTML
  }
}

const formatText = (command: string) => {
  document.execCommand(command)
}

const insertLink = () => {
  const url = prompt('Ingresa la URL:')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const insertImage = () => {
  const url = prompt('Ingresa la URL de la imagen:')
  if (url) {
    document.execCommand('insertImage', false, url)
  }
}

const insertVariable = () => {
  const variable = prompt('Ingresa la variable (ej: {{nombre}}):')
  if (variable) {
    insertVariableIntoEditor(variable)
  }
}

const insertVariableIntoEditor = (variable: string) => {
  if (isCodeMode.value) {
    // Insertar en textarea
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      textarea.value = text.substring(0, start) + variable + text.substring(end)
      templateData.html_content = textarea.value
      
      // Restaurar cursor
      nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length
        textarea.focus()
      })
    }
  } else {
    // Insertar en editor visual
    document.execCommand('insertText', false, variable)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Manejar atajos de teclado si es necesario
}

// Plantillas predefinidas
const loadPresetTemplate = () => {
  // Mostrar selector de plantillas
}

const loadPreset = (preset: any) => {
  if (confirm('¿Reemplazar el contenido actual con esta plantilla?')) {
    templateData.html_content = preset.content
    if (visualEditor.value && !isCodeMode.value) {
      visualEditor.value.innerHTML = preset.content
    }
  }
}

// Vista previa
const previewTemplate = () => {
  showPreviewModal.value = true
}

// Guardar plantilla
const saveTemplate = async () => {
  if (!canSave.value) return
  
  saving.value = true
  
  try {
    const templatePayload = {
      name: templateData.name,
      subject: templateData.subject,
      html_content: templateData.html_content,
      text_content: templateData.text_content || null,
      is_active: templateData.is_active
    }

    if (isEditing.value) {
      // Actualizar plantilla existente
      const { error } = await supabase
        .from('email_templates')
        .update(templatePayload)
        .eq('id', templateId.value)
      
      if (error) throw error
      
      alert('Plantilla actualizada exitosamente')
    } else {
      // Crear nueva plantilla
      const { error } = await supabase
        .from('email_templates')
        .insert([templatePayload])
      
      if (error) throw error
      
      alert('Plantilla creada exitosamente')
      
      // Redirigir a la lista de plantillas
      navigateTo('/templates')
    }
  } catch (error: any) {
    console.error('Error guardando plantilla:', error)
    alert(`Error al guardar la plantilla: ${error.message}`)
  } finally {
    saving.value = false
  }
}

// Cargar plantilla si estamos editando
onMounted(async () => {
  if (isEditing.value) {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId.value)
        .single()
      
      if (error) throw error
      
      if (data) {
        Object.assign(templateData, data)
        
        if (visualEditor.value && !isCodeMode.value) {
          visualEditor.value.innerHTML = data.content
        }
      }
    } catch (error) {
      console.error('Error cargando plantilla:', error)
      alert('Error al cargar la plantilla')
    }
  }
})
</script>

