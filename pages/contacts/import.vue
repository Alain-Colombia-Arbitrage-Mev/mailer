<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Importar Contactos</h1>
        <p class="mt-1 text-sm text-gray-500">
          Importa usuarios desde archivos CSV o Excel
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/contacts"
          class="btn btn-outline"
        >
          ← Volver a Contactos
        </NuxtLink>
      </div>
    </div>

    <!-- Import form -->
    <div class="card">
      <div class="card-body">
        <div class="space-y-6">
          <!-- File upload -->
          <div>
            <label class="form-label">Archivo de Contactos</label>
            <div class="dropzone" :class="{ 'dropzone-active': dragActive }">
              <input
                ref="fileInput"
                type="file"
                accept=".csv,.xlsx,.xls"
                @change="handleFileSelect"
                class="hidden"
              />
              <div class="text-center">
                <DocumentArrowUpIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p class="text-sm text-gray-600 mb-2">
                  Arrastra un archivo CSV o Excel aquí, o
                  <button
                    @click="$refs.fileInput.click()"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    selecciona un archivo
                  </button>
                </p>
                <p class="text-xs text-gray-500">
                  Formatos soportados: CSV, XLSX, XLS (máximo 10MB)
                </p>
              </div>
            </div>

            <div v-if="selectedFile" class="mt-4 bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <DocumentIcon class="w-5 h-5 text-gray-400 mr-2" />
                  <span class="text-sm text-gray-900">{{ selectedFile.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(selectedFile.size) }})</span>
                </div>
                <button
                  @click="selectedFile = null"
                  class="text-red-600 hover:text-red-500"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Import options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Configuración de Importación</label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="importOptions.skipDuplicates"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Omitir duplicados</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="importOptions.updateExisting"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Actualizar existentes</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="importOptions.validateEmails"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Validar emails</span>
                </label>
              </div>
            </div>

            <div>
              <label class="form-label">Balance Inicial</label>
              <input
                v-model.number="importOptions.defaultBalance"
                type="number"
                min="0"
                step="0.01"
                class="input"
                placeholder="0.00"
              />
              <p class="form-help">Balance inicial para nuevos usuarios</p>
            </div>
          </div>

          <!-- Column mapping preview -->
          <div v-if="previewData.length > 0" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Vista Previa y Mapeo de Columnas</h3>
            
            <div class="overflow-x-auto">
              <table class="table">
                <thead class="table-header">
                  <tr>
                    <th class="table-header-cell">Campo</th>
                    <th class="table-header-cell">Columna del Archivo</th>
                    <th class="table-header-cell">Vista Previa</th>
                  </tr>
                </thead>
                <tbody class="table-body">
                  <tr v-for="field in mappingFields" :key="field.key" class="table-row">
                    <td class="table-cell">
                      <span class="font-medium">{{ field.label }}</span>
                      <span v-if="field.required" class="text-red-500 ml-1">*</span>
                    </td>
                    <td class="table-cell">
                      <select
                        v-model="columnMapping[field.key]"
                        class="input"
                      >
                        <option value="">-- Seleccionar columna --</option>
                        <option
                          v-for="(column, index) in fileColumns"
                          :key="index"
                          :value="index"
                        >
                          {{ column }}
                        </option>
                      </select>
                    </td>
                    <td class="table-cell">
                      <span class="text-sm text-gray-600">
                        {{ getPreviewValue(field.key) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Import button -->
          <div class="flex justify-end space-x-3">
            <button
              @click="processFile"
              :disabled="!selectedFile || processing"
              class="btn btn-secondary"
            >
              Vista Previa
            </button>
            <button
              @click="importContacts"
              :disabled="!selectedFile || processing || previewData.length === 0"
              class="btn btn-primary"
            >
              <span v-if="processing" class="spinner mr-2"></span>
              {{ processing ? 'Importando...' : 'Importar Contactos' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import results -->
    <div v-if="importResults" class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">Resultados de Importación</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ importResults.total }}</div>
            <div class="text-sm text-gray-500">Total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ importResults.imported }}</div>
            <div class="text-sm text-gray-500">Importados</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ importResults.updated }}</div>
            <div class="text-sm text-gray-500">Actualizados</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ importResults.errors }}</div>
            <div class="text-sm text-gray-500">Errores</div>
          </div>
        </div>

        <div v-if="importResults.errorDetails.length > 0" class="space-y-2">
          <h4 class="font-medium text-gray-900">Errores Detallados:</h4>
          <div class="max-h-60 overflow-y-auto">
            <div
              v-for="(error, index) in importResults.errorDetails"
              :key="index"
              class="text-sm text-red-600 bg-red-50 p-2 rounded"
            >
              Fila {{ error.row }}: {{ error.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DocumentArrowUpIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// State
const selectedFile = ref<File | null>(null)
const processing = ref(false)
const dragActive = ref(false)
const previewData = ref<any[]>([])
const fileColumns = ref<string[]>([])
const importResults = ref<any>(null)

const importOptions = reactive({
  skipDuplicates: true,
  updateExisting: false,
  validateEmails: true,
  defaultBalance: 0
})

const columnMapping = reactive<Record<string, number | string>>({})

const mappingFields = [
  { key: 'firstName', label: 'Nombre', required: true },
  { key: 'lastName', label: 'Apellido', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'username', label: 'Usuario', required: false },
  { key: 'phoneNumber', label: 'Teléfono', required: false },
  { key: 'Gender', label: 'Género', required: false },
  { key: 'birthday', label: 'Fecha de Nacimiento', required: false },
  { key: 'Balance', label: 'Balance', required: false }
]

// Methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    importResults.value = null
    previewData.value = []
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const processFile = async () => {
  if (!selectedFile.value) return

  processing.value = true
  try {
    // Here you would implement CSV/Excel parsing
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data for demonstration
    fileColumns.value = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Balance']
    previewData.value = [
      { 'Nombre': 'Juan', 'Apellido': 'Pérez', 'Email': 'juan@example.com', 'Teléfono': '123456789', 'Balance': '100' },
      { 'Nombre': 'María', 'Apellido': 'García', 'Email': 'maria@example.com', 'Teléfono': '987654321', 'Balance': '200' }
    ]
    
    // Auto-map columns
    columnMapping.firstName = 0
    columnMapping.lastName = 1
    columnMapping.email = 2
    columnMapping.phoneNumber = 3
    columnMapping.Balance = 4
    
  } catch (error) {
    console.error('Error processing file:', error)
  } finally {
    processing.value = false
  }
}

const getPreviewValue = (fieldKey: string) => {
  const columnIndex = columnMapping[fieldKey]
  if (columnIndex !== undefined && previewData.value.length > 0) {
    const columnName = fileColumns.value[columnIndex as number]
    return previewData.value[0][columnName] || '-'
  }
  return '-'
}

const importContacts = async () => {
  if (!selectedFile.value || previewData.value.length === 0) return

  processing.value = true
  try {
    // Here you would implement the actual import logic
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock results
    importResults.value = {
      total: previewData.value.length,
      imported: previewData.value.length - 1,
      updated: 0,
      errors: 1,
      errorDetails: [
        { row: 2, message: 'Email duplicado: maria@example.com' }
      ]
    }
    
  } catch (error) {
    console.error('Error importing contacts:', error)
  } finally {
    processing.value = false
  }
}
</script>
