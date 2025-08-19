<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          {{ contact ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre"
            />
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apellido"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@ejemplo.com"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1234567890"
          />
        </div>

        <!-- Empresa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Empresa
          </label>
          <input
            v-model="form.company"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre de la empresa"
          />
        </div>

        <!-- Género -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            v-model="form.gender"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        <!-- Fecha de Nacimiento -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            v-model="form.birthday"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Etiquetas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas
          </label>
          <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px]">
            <span
              v-for="tagId in form.tags"
              :key="tagId"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ getTagName(tagId) }}
              <button
                @click="removeTag(tagId)"
                type="button"
                class="ml-1 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon class="h-3 w-3" />
              </button>
            </span>
          </div>
          <select
            v-model="selectedTag"
            @change="addTag"
            class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar etiqueta...</option>
            <option
              v-for="tag in availableTags"
              :key="tag.id"
              :value="tag.id"
            >
              {{ tag.name }}
            </option>
          </select>
        </div>

        <!-- Notas -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Notas adicionales sobre el contacto..."
          ></textarea>
        </div>

        <!-- Estado -->
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Contacto activo</span>
          </label>
          
          <label class="flex items-center">
            <input
              v-model="form.emailVerified"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Email verificado</span>
          </label>
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
            :disabled="saving"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Guardando...' : (contact ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  contact: {
    type: Object,
    default: null
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// Estado
const saving = ref(false)
const selectedTag = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  company: '', // Campo adicional no disponible en USERS
  position: '', // Campo adicional no disponible en USERS
  notes: '', // Campo adicional no disponible en USERS
  is_active: true,
  emailVerified: false,
  tags: []
})

// Computed
const availableTags = computed(() => {
  return props.tags.filter(tag => !form.tags.includes(tag.id))
})

// Métodos
const getTagName = (tagId) => {
  const tag = props.tags.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

const addTag = () => {
  if (selectedTag.value && !form.tags.includes(selectedTag.value)) {
    form.tags.push(selectedTag.value)
    selectedTag.value = ''
  }
}

const removeTag = (tagId) => {
  form.tags = form.tags.filter(id => id !== tagId)
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const contactData = { ...form }
    if (props.contact) {
      contactData.idPerson = props.contact.idPerson
    }
    
    emit('save', contactData)
  } catch (error) {
    console.error('Error en formulario:', error)
  } finally {
    saving.value = false
  }
}

// Inicialización
onMounted(() => {
  if (props.contact) {
    Object.assign(form, {
      firstName: props.contact.firstName || '',
      lastName: props.contact.lastName || '',
      email: props.contact.email || '',
      phone: props.contact.phone || '',
      gender: props.contact.gender || '',
      birthday: props.contact.birthday || '',
      company: props.contact.company || '',
      position: props.contact.position || '',
      notes: props.contact.notes || '',
      is_active: props.contact.is_active ?? true,
      emailVerified: props.contact.emailVerified ?? false,
      tags: [] // Se cargarían las etiquetas del contacto
    })
  }
})
</script>
