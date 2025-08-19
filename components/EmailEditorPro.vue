<template>
  <div class="email-editor-container">
    <!-- Toolbar personalizada -->
    <div class="editor-toolbar bg-gray-50 border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-2">
      <div class="flex items-center space-x-1">
        <button
          @click="toggleBold"
          :class="{ 'bg-blue-100 text-blue-600': isBold }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Negrita"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 4v12h4.5c2.5 0 4.5-2 4.5-4.5 0-1.5-.8-2.8-2-3.5 1.2-.7 2-2 2-3.5C15 2 13 0 10.5 0H6v4zm2-2h2.5C11.3 2 12 2.7 12 3.5S11.3 5 10.5 5H8V2zm0 5h3c1.1 0 2 .9 2 2s-.9 2-2 2H8V7z"/>
          </svg>
        </button>
        <button
          @click="toggleItalic"
          :class="{ 'bg-blue-100 text-blue-600': isItalic }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Cursiva"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 1h8v2h-2.5L9.5 17H12v2H4v-2h2.5L10.5 3H8V1z"/>
          </svg>
        </button>
        <button
          @click="toggleUnderline"
          :class="{ 'bg-blue-100 text-blue-600': isUnderline }"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Subrayado"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18c4.4 0 8-3.6 8-8V2h-2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6V2H2v8c0 4.4 3.6 8 8 8zM2 20h16v2H2v-2z"/>
          </svg>
        </button>
      </div>
      
      <div class="border-l border-gray-300 mx-2"></div>
      
      <div class="flex items-center space-x-1">
        <select
          @change="changeFontSize"
          class="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="12px">12px</option>
          <option value="14px" selected>14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
        </select>
        
        <input
          type="color"
          @change="changeTextColor"
          class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Color de texto"
        />
      </div>
      
      <div class="border-l border-gray-300 mx-2"></div>
      
      <div class="flex items-center space-x-1">
        <button
          @click="insertLink"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insertar enlace"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"/>
            <path d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z"/>
          </svg>
        </button>
        
        <button
          @click="insertImage"
          class="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insertar imagen"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      
      <div class="border-l border-gray-300 mx-2"></div>
      
      <div class="flex items-center space-x-1">
        <button
          @click="insertTemplate"
          class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          📧 Plantilla
        </button>
        
        <button
          @click="showResponsiveBuilder = true"
          class="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
        >
          📱 HTML Responsivo
        </button>
        
        <button
          @click="togglePreview"
          class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
        >
          {{ showPreview ? '✏️ Editar' : '👁️ Vista Previa' }}
        </button>
      </div>
    </div>

    <!-- Editor o Vista Previa -->
    <div class="editor-content border-l border-r border-b border-gray-200 rounded-b-lg">
      <div v-if="!showPreview" class="relative">
        <div
          ref="editor"
          @input="handleInput"
          @keyup="updateToolbarState"
          @mouseup="updateToolbarState"
          contenteditable="true"
          class="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;"
          placeholder="Escribe tu email aquí..."
        >
        </div>
        
        <!-- Contador de caracteres -->
        <div class="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
          {{ characterCount }} caracteres
        </div>
      </div>
      
      <!-- Vista Previa -->
      <div v-else class="preview-container">
        <div class="bg-gray-100 p-4 border-b">
          <h3 class="font-semibold text-gray-700">Vista Previa del Email</h3>
          <p class="text-sm text-gray-500">Así se verá tu email en el cliente de correo</p>
        </div>
        <div class="email-preview bg-white p-6">
          <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold">📧</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ fromEmail || 'info@be-mindpower.net' }}</p>
                    <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString() }}</p>
                  </div>
                </div>
              </div>
              <h2 class="mt-3 text-xl font-bold text-gray-900">{{ subject || 'Sin asunto' }}</h2>
            </div>
            <div class="p-6" v-html="modelValue"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para plantillas -->
    <div v-if="showTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Seleccionar Plantilla</h3>
            <button @click="showTemplateModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="template in templates"
              :key="template.id"
              @click="applyTemplate(template)"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h4 class="font-semibold text-gray-900 mb-2">{{ template.name }}</h4>
              <p class="text-sm text-gray-600 mb-3">{{ template.subject }}</p>
              <div class="text-xs text-gray-500 line-clamp-3" v-html="template.html_content"></div>
            </div>
          </div>
          <div v-if="templates.length === 0" class="text-center py-8 text-gray-500">
            No hay plantillas disponibles
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para constructor HTML responsivo -->
    <div v-if="showResponsiveBuilder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Constructor HTML Responsivo para Emails</h3>
            <button @click="showResponsiveBuilder = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="overflow-y-auto max-h-[80vh]">
          <EmailTemplateBuilder
            :model-value="modelValue"
            @update:model-value="handleResponsiveUpdate"
          />
        </div>
        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-end space-x-3">
            <button
              @click="showResponsiveBuilder = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="applyResponsiveHtml"
              class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Aplicar HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: ''
  },
  fromEmail: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Referencias
const editor = ref<HTMLElement>()
const showPreview = ref(false)
const showTemplateModal = ref(false)
const showResponsiveBuilder = ref(false)
const templates = ref([])
const responsiveHtml = ref('')

// Estados del toolbar
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)

// Contador de caracteres
const characterCount = computed(() => {
  const text = editor.value?.textContent || ''
  return text.length
})

// Métodos del editor
const handleInput = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}

const updateToolbarState = () => {
  if (!editor.value) return
  
  isBold.value = document.queryCommandState('bold')
  isItalic.value = document.queryCommandState('italic')
  isUnderline.value = document.queryCommandState('underline')
}

const toggleBold = () => {
  document.execCommand('bold')
  updateToolbarState()
  handleInput()
}

const toggleItalic = () => {
  document.execCommand('italic')
  updateToolbarState()
  handleInput()
}

const toggleUnderline = () => {
  document.execCommand('underline')
  updateToolbarState()
  handleInput()
}

const changeFontSize = (event: Event) => {
  const target = event.target as HTMLSelectElement
  document.execCommand('fontSize', false, '3')
  const fontElements = document.querySelectorAll('font[size="3"]')
  fontElements.forEach(el => {
    el.removeAttribute('size')
    ;(el as HTMLElement).style.fontSize = target.value
  })
  handleInput()
}

const changeTextColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  document.execCommand('foreColor', false, target.value)
  handleInput()
}

const insertLink = () => {
  const url = prompt('Ingresa la URL del enlace:')
  if (url) {
    document.execCommand('createLink', false, url)
    handleInput()
  }
}

const insertImage = () => {
  const url = prompt('Ingresa la URL de la imagen:')
  if (url) {
    document.execCommand('insertImage', false, url)
    handleInput()
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const insertTemplate = async () => {
  showTemplateModal.value = true
  await loadTemplates()
}

const loadTemplates = async () => {
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    templates.value = data || []
  } catch (error) {
    console.error('Error cargando plantillas:', error)
  }
}

const applyTemplate = (template: any) => {
  if (editor.value) {
    editor.value.innerHTML = template.html_content
    emit('update:modelValue', template.html_content)
  }
  showTemplateModal.value = false
}

const handleResponsiveUpdate = (html: string) => {
  responsiveHtml.value = html
}

const applyResponsiveHtml = () => {
  if (editor.value && responsiveHtml.value) {
    editor.value.innerHTML = responsiveHtml.value
    emit('update:modelValue', responsiveHtml.value)
  }
  showResponsiveBuilder.value = false
}

// Inicializar contenido
onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.innerHTML = props.modelValue
  }
})

// Watch para cambios externos
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue
  }
})
</script>

<style scoped>
.email-editor-container {
  @apply w-full;
}

.editor-content [contenteditable]:empty:before {
  content: attr(placeholder);
  @apply text-gray-400;
  pointer-events: none;
}

.preview-container {
  @apply min-h-[400px];
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para el contenido del editor */
.editor-content [contenteditable] h1 {
  @apply text-2xl font-bold mb-4;
}

.editor-content [contenteditable] h2 {
  @apply text-xl font-bold mb-3;
}

.editor-content [contenteditable] h3 {
  @apply text-lg font-bold mb-2;
}

.editor-content [contenteditable] p {
  @apply mb-2;
}

.editor-content [contenteditable] ul {
  @apply list-disc ml-6 mb-2;
}

.editor-content [contenteditable] ol {
  @apply list-decimal ml-6 mb-2;
}

.editor-content [contenteditable] a {
  @apply text-blue-600 underline;
}

.editor-content [contenteditable] img {
  @apply max-w-full h-auto rounded;
}
</style>
