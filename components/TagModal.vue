<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Nueva Etiqueta</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la etiqueta"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción opcional..."
          ></textarea>
        </div>

        <!-- Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div class="flex items-center space-x-2">
            <input
              v-model="form.color"
              type="color"
              class="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              v-model="form.color"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3B82F6"
            />
          </div>
          <div class="mt-2 flex space-x-2">
            <button
              v-for="color in presetColors"
              :key="color"
              type="button"
              @click="form.color = color"
              :style="{ backgroundColor: color }"
              class="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400"
            ></button>
          </div>
        </div>

        <!-- Vista previa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Vista Previa
          </label>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :style="{ backgroundColor: form.color + '20', color: form.color }"
          >
            {{ form.name || 'Nombre de la etiqueta' }}
          </span>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!form.name || saving"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Creando...' : 'Crear Etiqueta' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'save'])

// Estado
const saving = ref(false)

const form = reactive({
  name: '',
  description: '',
  color: '#3B82F6'
})

const presetColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280'  // Gray
]

// Métodos
const handleSubmit = async () => {
  if (!form.name) return
  
  saving.value = true
  try {
    emit('save', { ...form })
  } catch (error) {
    console.error('Error creando etiqueta:', error)
  } finally {
    saving.value = false
  }
}
</script>

