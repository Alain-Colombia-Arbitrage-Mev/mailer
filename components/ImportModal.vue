<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Importar Contactos</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div v-if="step === 1" class="space-y-6">
        <!-- Paso 1: Seleccionar archivo -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">Paso 1: Seleccionar Archivo</h4>
          
          <!-- Zona de Drop -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            :class="{
              'border-blue-500 bg-blue-50': isDragging,
              'border-gray-300': !isDragging
            }"
            class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            @click="$refs.fileInput.click()"
          >
            <DocumentArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
            <p class="mt-2 text-sm text-gray-600">
              Arrastra tu archivo CSV/Excel aquí o haz clic para seleccionar
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Formatos soportados: .csv, .xlsx, .xls
            </p>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            accept=".csv,.xlsx,.xls"
            class="hidden"
          />

          <!-- Archivo seleccionado -->
          <div v-if="selectedFile" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <DocumentIcon class="h-8 w-8 text-blue-500" />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
              <button
                @click="removeFile"
                class="text-red-500 hover:text-red-700"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Plantilla de ejemplo -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 class="text-sm font-medium text-blue-900 mb-2">Formato Requerido</h5>
          <p class="text-sm text-blue-700 mb-3">
            Tu archivo debe contener las siguientes columnas (en cualquier orden):
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span class="bg-white px-2 py-1 rounded border">firstName</span>
            <span class="bg-white px-2 py-1 rounded border">lastName</span>
            <span class="bg-white px-2 py-1 rounded border">email</span>
            <span class="bg-white px-2 py-1 rounded border">phone</span>
            <span class="bg-white px-2 py-1 rounded border">company</span>
            <span class="bg-white px-2 py-1 rounded border">position</span>
            <span class="bg-white px-2 py-1 rounded border">notes</span>
            <span class="bg-white px-2 py-1 rounded border">tags</span>
          </div>
          <div class="mt-3">
            <button
              @click="downloadTemplate"
              class="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Descargar plantilla de ejemplo
            </button>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="processFile"
            :disabled="!selectedFile || processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {{ processing ? 'Procesando...' : 'Siguiente' }}
          </button>
        </div>
      </div>

      <div v-else-if="step === 2" class="space-y-6">
        <!-- Paso 2: Mapear columnas -->
        <div>
          <h4 class="text-md font-medium text-gray-900 mb-3">Paso 2: Mapear Columnas</h4>
          <p class="text-sm text-gray-600 mb-4">
            Asocia las columnas de tu archivo con los campos del sistema:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="field in requiredFields"
              :key="field.key"
              class="space-y-2"
            >
              <label class="block text-sm font-medium text-gray-700">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <select
                v-model="columnMapping[field.key]"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleccionar columna --</option>
                <option
                  v-for="(column, index) in detectedColumns"
                  :key="index"
                  :value="index"
                >
                  {{ column }} ({{ previewData[0]?.[index] || 'Sin datos' }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Vista previa -->
        <div v-if="previewData.length > 0">
          <h5 class="text-sm font-medium text-gray-900 mb-3">Vista Previa (primeras 5 filas)</h5>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="field in requiredFields.filter(f => columnMapping[f.key] !== '')"
                    :key="field.key"
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ field.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(row, index) in previewData.slice(0, 5)"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td
                    v-for="field in requiredFields.filter(f => columnMapping[f.key] !== '')"
                    :key="field.key"
                    class="px-4 py-2 text-sm text-gray-900"
                  >
                    {{ row[columnMapping[field.key]] || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Opciones de importación -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h5 class="text-sm font-medium text-gray-900 mb-3">Opciones de Importación</h5>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="importOptions.skipDuplicates"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Omitir contactos duplicados (por email)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="importOptions.validateEmails"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Validar formato de emails</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="importOptions.markAsVerified"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Marcar emails como verificados</span>
            </label>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-between">
          <button
            @click="step = 1"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Anterior
          </button>
          <div class="space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="importContacts"
              :disabled="!canImport || importing"
              class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {{ importing ? 'Importando...' : `Importar ${previewData.length} contactos` }}
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="step === 3" class="space-y-6">
        <!-- Paso 3: Resultado -->
        <div class="text-center">
          <CheckCircleIcon class="mx-auto h-16 w-16 text-green-500" />
          <h4 class="text-lg font-medium text-gray-900 mt-4">¡Importación Completada!</h4>
          
          <div class="mt-6 bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-green-600">{{ importResult.imported }}</p>
                <p class="text-sm text-gray-600">Importados</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-yellow-600">{{ importResult.skipped }}</p>
                <p class="text-sm text-gray-600">Omitidos</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600">{{ importResult.errors }}</p>
                <p class="text-sm text-gray-600">Errores</p>
              </div>
            </div>
          </div>

          <!-- Errores detallados -->
          <div v-if="importResult.errorDetails.length > 0" class="mt-4">
            <details class="text-left">
              <summary class="cursor-pointer text-sm text-red-600 hover:text-red-800">
                Ver detalles de errores
              </summary>
              <div class="mt-2 max-h-40 overflow-y-auto bg-red-50 p-3 rounded border text-xs">
                <div
                  v-for="(error, index) in importResult.errorDetails"
                  :key="index"
                  class="mb-1"
                >
                  Fila {{ error.row }}: {{ error.message }}
                </div>
              </div>
            </details>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-center">
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
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
  XMarkIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const emit = defineEmits(['close', 'import'])

// Estado
const step = ref(1)
const selectedFile = ref(null)
const processing = ref(false)
const importing = ref(false)
const isDragging = ref(false)

const detectedColumns = ref([])
const previewData = ref([])
const columnMapping = reactive({})
const importOptions = reactive({
  skipDuplicates: true,
  validateEmails: true,
  markAsVerified: false
})

const importResult = reactive({
  imported: 0,
  skipped: 0,
  errors: 0,
  errorDetails: []
})

const requiredFields = [
  { key: 'firstName', label: 'Nombre', required: true },
  { key: 'lastName', label: 'Apellido', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Teléfono', required: false },
  { key: 'company', label: 'Empresa', required: false },
  { key: 'position', label: 'Cargo', required: false },
  { key: 'notes', label: 'Notas', required: false },
  { key: 'tags', label: 'Etiquetas', required: false }
]

// Computed
const canImport = computed(() => {
  const requiredMapped = requiredFields
    .filter(field => field.required)
    .every(field => columnMapping[field.key] !== '' && columnMapping[field.key] !== undefined)
  
  return requiredMapped && previewData.value.length > 0
})

// Métodos de archivo
const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer.files)
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = (file) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
    alert('Formato de archivo no soportado. Use CSV, XLS o XLSX.')
    return
  }
  
  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  detectedColumns.value = []
  previewData.value = []
  Object.keys(columnMapping).forEach(key => {
    columnMapping[key] = ''
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Procesamiento de archivo
const processFile = async () => {
  if (!selectedFile.value) return
  
  processing.value = true
  
  try {
    if (selectedFile.value.name.endsWith('.csv')) {
      await processCSV()
    } else {
      await processExcel()
    }
    
    // Auto-mapear columnas comunes
    autoMapColumns()
    
    step.value = 2
  } catch (error) {
    console.error('Error procesando archivo:', error)
    alert('Error al procesar el archivo. Verifique el formato.')
  } finally {
    processing.value = false
  }
}

const processCSV = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(selectedFile.value, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('Errores en CSV:', results.errors)
        }
        
        detectedColumns.value = results.meta.fields || []
        previewData.value = results.data
        resolve(results)
      },
      error: reject
    })
  })
}

const processExcel = () => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length === 0) {
          reject(new Error('El archivo está vacío'))
          return
        }
        
        detectedColumns.value = jsonData[0] || []
        previewData.value = jsonData.slice(1).map(row => {
          const obj = {}
          detectedColumns.value.forEach((col, index) => {
            obj[index] = row[index] || ''
          })
          return obj
        })
        
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = reject
    reader.readAsArrayBuffer(selectedFile.value)
  })
}

const autoMapColumns = () => {
  const columnLower = detectedColumns.value.map(col => col.toLowerCase())
  
  requiredFields.forEach(field => {
    const possibleNames = {
      firstName: ['firstname', 'first_name', 'nombre', 'name'],
      lastName: ['lastname', 'last_name', 'apellido', 'surname'],
      email: ['email', 'correo', 'mail', 'e-mail'],
      phone: ['phone', 'telefono', 'teléfono', 'tel', 'mobile'],
      company: ['company', 'empresa', 'organization'],
      position: ['position', 'cargo', 'job', 'title'],
      notes: ['notes', 'notas', 'comments', 'comentarios'],
      tags: ['tags', 'etiquetas', 'labels', 'categories']
    }
    
    const matches = possibleNames[field.key] || []
    const foundIndex = columnLower.findIndex(col => 
      matches.some(match => col.includes(match))
    )
    
    if (foundIndex !== -1) {
      columnMapping[field.key] = foundIndex
    }
  })
}

// Importación
const importContacts = async () => {
  importing.value = true
  
  try {
    const contactsToImport = []
    const errors = []
    
    previewData.value.forEach((row, index) => {
      try {
        const contact = {}
        
        // Mapear campos
        requiredFields.forEach(field => {
          if (columnMapping[field.key] !== '' && columnMapping[field.key] !== undefined) {
            contact[field.key] = row[columnMapping[field.key]] || ''
          }
        })
        
        // Validaciones
        if (!contact.firstName || !contact.lastName || !contact.email) {
          errors.push({
            row: index + 2, // +2 porque empezamos en 1 y saltamos header
            message: 'Faltan campos requeridos (nombre, apellido, email)'
          })
          return
        }
        
        if (importOptions.validateEmails && !isValidEmail(contact.email)) {
          errors.push({
            row: index + 2,
            message: `Email inválido: ${contact.email}`
          })
          return
        }
        
        // Configurar campos adicionales
        contact.is_active = true
        contact.emailVerified = importOptions.markAsVerified
        
        // Procesar etiquetas si existen
        if (contact.tags) {
          contact.tags = contact.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }
        
        contactsToImport.push(contact)
      } catch (error) {
        errors.push({
          row: index + 2,
          message: error.message
        })
      }
    })
    
    // Simular importación (aquí iría la lógica real)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Resultados simulados
    importResult.imported = contactsToImport.length
    importResult.skipped = 0 // Se calcularía basado en duplicados
    importResult.errors = errors.length
    importResult.errorDetails = errors
    
    // Emitir evento de importación
    emit('import', {
      contacts: contactsToImport,
      options: importOptions
    })
    
    step.value = 3
  } catch (error) {
    console.error('Error importando contactos:', error)
    alert('Error durante la importación')
  } finally {
    importing.value = false
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Plantilla
const downloadTemplate = () => {
  const headers = requiredFields.map(field => field.key)
  const sampleData = [
    ['Juan', 'Pérez', 'juan@ejemplo.com', '+1234567890', 'Empresa ABC', 'Gerente', 'Contacto importante', 'cliente,vip'],
    ['María', 'García', 'maria@ejemplo.com', '+0987654321', 'Empresa XYZ', 'Directora', 'Reunión pendiente', 'prospecto']
  ]
  
  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'plantilla_contactos.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Eventos drag
onMounted(() => {
  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', (e) => e.preventDefault())
})
</script>

