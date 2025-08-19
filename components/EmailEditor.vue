<template>
  <div class="email-editor">
    <!-- Toolbar del Editor -->
    <div class="editor-toolbar bg-gray-100 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-2">
      <!-- Formato de Texto -->
      <div class="flex gap-1">
        <button 
          @click="execCommand('bold')"
          class="p-2 hover:bg-gray-200 rounded"
          title="Negrita"
        >
          <strong>B</strong>
        </button>
        <button 
          @click="execCommand('italic')"
          class="p-2 hover:bg-gray-200 rounded"
          title="Cursiva"
        >
          <em>I</em>
        </button>
        <button 
          @click="execCommand('underline')"
          class="p-2 hover:bg-gray-200 rounded"
          title="Subrayado"
        >
          <u>U</u>
        </button>
      </div>

      <div class="border-l border-gray-300 mx-2"></div>

      <!-- Alineación -->
      <div class="flex gap-1">
        <button 
          @click="execCommand('justifyLeft')"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Alinear Izquierda"
        >
          ⬅️
        </button>
        <button 
          @click="execCommand('justifyCenter')"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Centrar"
        >
          ⬆️
        </button>
        <button 
          @click="execCommand('justifyRight')"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Alinear Derecha"
        >
          ➡️
        </button>
      </div>

      <div class="border-l border-gray-300 mx-2"></div>

      <!-- Listas -->
      <div class="flex gap-1">
        <button 
          @click="execCommand('insertUnorderedList')"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Lista con Viñetas"
        >
          • Lista
        </button>
        <button 
          @click="execCommand('insertOrderedList')"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Lista Numerada"
        >
          1. Lista
        </button>
      </div>

      <div class="border-l border-gray-300 mx-2"></div>

      <!-- Enlaces e Imágenes -->
      <div class="flex gap-1">
        <button 
          @click="insertLink"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Insertar Enlace"
        >
          🔗 Link
        </button>
        <button 
          @click="insertImage"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          title="Insertar Imagen"
        >
          🖼️ Img
        </button>
      </div>

      <div class="border-l border-gray-300 mx-2"></div>

      <!-- Plantillas Rápidas -->
      <div class="flex gap-1">
        <select 
          @change="insertTemplate"
          class="px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="">Plantillas Rápidas</option>
          <option value="header">Encabezado</option>
          <option value="button">Botón</option>
          <option value="footer">Pie de Página</option>
          <option value="signature">Firma</option>
        </select>
      </div>

      <div class="border-l border-gray-300 mx-2"></div>

      <!-- Vista Previa -->
      <div class="flex gap-1">
        <button 
          @click="togglePreview"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          :class="{ 'bg-blue-200': showPreview }"
          title="Vista Previa"
        >
          👁️ Preview
        </button>
        <button 
          @click="toggleResponsive"
          class="p-2 hover:bg-gray-200 rounded text-sm"
          :class="{ 'bg-green-200': responsiveMode }"
          title="Modo Responsivo"
        >
          📱 Mobile
        </button>
      </div>
    </div>

    <!-- Editor Principal -->
    <div class="editor-container border-l border-r border-b border-gray-300 rounded-b-lg">
      <!-- Modo Edición -->
      <div 
        v-show="!showPreview"
        ref="editor"
        class="editor-content"
        :class="[
          'min-h-[400px] p-4 focus:outline-none',
          responsiveMode ? 'max-w-sm mx-auto' : 'w-full'
        ]"
        contenteditable="true"
        @input="updateContent"
        @paste="handlePaste"
        style="background: white;"
      >
        <!-- El contenido se insertará aquí -->
      </div>

      <!-- Modo Vista Previa -->
      <div 
        v-show="showPreview"
        class="preview-content"
        :class="[
          'min-h-[400px] p-4 bg-gray-50',
          responsiveMode ? 'max-w-sm mx-auto' : 'w-full'
        ]"
        v-html="modelValue"
      >
      </div>
    </div>

    <!-- Información del Editor -->
    <div class="editor-info mt-2 text-xs text-gray-500 flex justify-between">
      <span>Caracteres: {{ characterCount }}</span>
      <span v-if="responsiveMode">Modo Mobile (320px)</span>
      <span v-else>Modo Desktop</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Escribe tu email aquí...'
})

const emit = defineEmits<Emits>()

const editor = ref<HTMLElement>()
const showPreview = ref(false)
const responsiveMode = ref(false)

const characterCount = computed(() => {
  return props.modelValue.replace(/<[^>]*>/g, '').length
})

// Inicializar editor
onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = props.modelValue || `
      <h1 style="color: #333; font-family: Arial, sans-serif;">¡Hola!</h1>
      <p style="font-family: Arial, sans-serif; line-height: 1.6;">
        Bienvenido a nuestro sistema de emails. Puedes editar este contenido usando las herramientas de arriba.
      </p>
      <p style="font-family: Arial, sans-serif; line-height: 1.6;">
        <strong>Características:</strong>
      </p>
      <ul style="font-family: Arial, sans-serif; line-height: 1.6;">
        <li>Editor HTML rico</li>
        <li>Vista previa en tiempo real</li>
        <li>Modo responsivo para mobile</li>
        <li>Plantillas rápidas</li>
      </ul>
    `
  }
})

// Ejecutar comandos del editor
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  updateContent()
}

// Actualizar contenido
const updateContent = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.innerHTML)
  }
}

// Manejar pegado
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') || ''
  const html = event.clipboardData?.getData('text/html') || ''
  
  // Si hay HTML, usarlo; si no, usar texto plano
  const content = html || text.replace(/\n/g, '<br>')
  document.execCommand('insertHTML', false, content)
  updateContent()
}

// Insertar enlace
const insertLink = () => {
  const url = prompt('Ingresa la URL:')
  if (url) {
    const text = prompt('Texto del enlace:', url)
    if (text) {
      execCommand('insertHTML', `<a href="${url}" style="color: #007bff; text-decoration: none;">${text}</a>`)
    }
  }
}

// Insertar imagen
const insertImage = () => {
  const url = prompt('URL de la imagen:')
  if (url) {
    const alt = prompt('Texto alternativo:', 'Imagen')
    execCommand('insertHTML', `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 4px;">`)
  }
}

// Insertar plantillas
const insertTemplate = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const template = select.value
  
  if (!template) return
  
  const templates = {
    header: `
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="color: #333; margin: 0; font-family: Arial, sans-serif;">Tu Empresa</h1>
        <p style="color: #666; margin: 5px 0 0 0; font-family: Arial, sans-serif;">Slogan o descripción</p>
      </div>
    `,
    button: `
      <div style="text-align: center; margin: 20px 0;">
        <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-family: Arial, sans-serif;">Botón de Acción</a>
      </div>
    `,
    footer: `
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-family: Arial, sans-serif;">
        <p style="color: #666; margin: 0; font-size: 14px;">© 2024 Tu Empresa. Todos los derechos reservados.</p>
        <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">
          <a href="#" style="color: #007bff; text-decoration: none;">Cancelar suscripción</a> | 
          <a href="#" style="color: #007bff; text-decoration: none;">Política de privacidad</a>
        </p>
      </div>
    `,
    signature: `
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; font-family: Arial, sans-serif;">
        <p style="margin: 0; font-weight: bold; color: #333;">Tu Nombre</p>
        <p style="margin: 2px 0; color: #666;">Cargo | Tu Empresa</p>
        <p style="margin: 2px 0; color: #666;">📧 email@empresa.com | 📞 +1 234 567 890</p>
        <p style="margin: 2px 0; color: #666;">🌐 www.tuempresa.com</p>
      </div>
    `
  }
  
  if (templates[template as keyof typeof templates]) {
    execCommand('insertHTML', templates[template as keyof typeof templates])
  }
  
  select.value = ''
}

// Toggle vista previa
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// Toggle modo responsivo
const toggleResponsive = () => {
  responsiveMode.value = !responsiveMode.value
}

// Watch para cambios externos
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue
  }
})
</script>

<style scoped>
.editor-content {
  outline: none;
}

.editor-content:focus {
  box-shadow: inset 0 0 0 2px #3b82f6;
}

.editor-content h1, .editor-content h2, .editor-content h3 {
  font-family: Arial, sans-serif;
  color: #333;
  margin: 16px 0 8px 0;
}

.editor-content p {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 8px 0;
}

.editor-content ul, .editor-content ol {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 8px 0;
  padding-left: 20px;
}

.editor-content a {
  color: #007bff;
  text-decoration: none;
}

.editor-content a:hover {
  text-decoration: underline;
}

.editor-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* Modo responsivo */
.editor-container.responsive {
  max-width: 320px;
  margin: 0 auto;
}
</style>


