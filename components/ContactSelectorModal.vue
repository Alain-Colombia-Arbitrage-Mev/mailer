<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Seleccionar Contactos</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="px-6 py-4 border-b border-gray-200 bg-white">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre o email..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Filtro por etiquetas -->
          <div class="sm:w-64">
            <select
              v-model="selectedTag"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las etiquetas</option>
              <option v-for="tag in availableTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{{ filteredContacts.length }} contactos encontrados</span>
          <span v-if="selectedContacts.length > 0">
            {{ selectedContacts.length }} seleccionados
          </span>
        </div>
      </div>

      <!-- Lista de contactos -->
      <div class="flex-1 overflow-y-auto max-h-96">
        <div class="px-6 py-4">
          <!-- Seleccionar todos -->
          <div class="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-3 text-sm font-medium text-gray-700">
              Seleccionar todos los contactos visibles
            </label>
          </div>

          <!-- Lista de contactos -->
          <div class="space-y-2">
            <div
              v-for="contact in paginatedContacts"
              :key="contact.idPerson"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                :checked="selectedContacts.includes(contact.idPerson)"
                @change="toggleContact(contact.idPerson)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              
              <div class="ml-3 flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ getContactName(contact) }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ contact.email || 'Sin email' }}
                    </p>
                  </div>
                  
                  <div class="ml-4 flex-shrink-0">
                    <div class="flex items-center space-x-2">
                      <!-- Balance -->
                      <span v-if="contact.Balance" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${{ contact.Balance }}
                      </span>
                      
                      <!-- Género -->
                      <span v-if="contact.Gender" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ contact.Gender }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Información adicional -->
                <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span v-if="contact.phoneNumber">📱 {{ contact.phoneNumber }}</span>
                  <span v-if="contact.birthday">🎂 {{ contact.birthday }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span class="text-sm text-gray-600">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Footer con acciones -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            {{ selectedContacts.length }} contactos seleccionados
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              @click="confirmSelection"
              :disabled="selectedContacts.length === 0"
              class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Agregar {{ selectedContacts.length }} contactos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'select'])

// Estado
const contacts = ref([])
const selectedContacts = ref<number[]>([])
const searchQuery = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const itemsPerPage = 20
const loading = ref(false)

// Tags disponibles (simulado)
const availableTags = ref(['VIP', 'Premium', 'Activo', 'Nuevo', 'Inactivo'])

// Computed
const filteredContacts = computed(() => {
  let filtered = contacts.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact => {
      const name = getContactName(contact).toLowerCase()
      const email = (contact.email || '').toLowerCase()
      return name.includes(query) || email.includes(query)
    })
  }

  // Filtrar por etiqueta (simulado)
  if (selectedTag.value) {
    // Aquí podrías filtrar por etiquetas reales
    filtered = filtered.filter(contact => {
      // Simulación: algunos contactos tienen ciertas etiquetas
      if (selectedTag.value === 'VIP' && contact.Balance > 1000) return true
      if (selectedTag.value === 'Premium' && contact.Balance > 500) return true
      if (selectedTag.value === 'Activo' && contact.email) return true
      return false
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredContacts.value.length / itemsPerPage)
})

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredContacts.value.slice(start, end)
})

const isAllSelected = computed(() => {
  return paginatedContacts.value.length > 0 && 
         paginatedContacts.value.every(contact => selectedContacts.value.includes(contact.idPerson))
})

// Métodos
const getContactName = (contact: any) => {
  const firstName = contact.firstName || ''
  const lastName = contact.lastName || ''
  const name = `${firstName} ${lastName}`.trim()
  return name || 'Sin nombre'
}

const toggleContact = (contactId: number) => {
  const index = selectedContacts.value.indexOf(contactId)
  if (index > -1) {
    selectedContacts.value.splice(index, 1)
  } else {
    selectedContacts.value.push(contactId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deseleccionar todos los visibles
    paginatedContacts.value.forEach(contact => {
      const index = selectedContacts.value.indexOf(contact.idPerson)
      if (index > -1) {
        selectedContacts.value.splice(index, 1)
      }
    })
  } else {
    // Seleccionar todos los visibles
    paginatedContacts.value.forEach(contact => {
      if (!selectedContacts.value.includes(contact.idPerson)) {
        selectedContacts.value.push(contact.idPerson)
      }
    })
  }
}

const confirmSelection = () => {
  const selected = contacts.value.filter(contact => 
    selectedContacts.value.includes(contact.idPerson)
  )
  emit('select', selected)
}

const loadContacts = async () => {
  loading.value = true
  try {
    const supabase = useSupabaseClient()
    const { data, error } = await supabase
      .from('USERS')
      .select('idPerson, firstName, lastName, email, phoneNumber, Gender, birthday, Balance')
      .not('email', 'is', null)
      .order('firstName', { ascending: true })
      .limit(1000) // Limitar para rendimiento

    if (error) throw error
    contacts.value = data || []
  } catch (error) {
    console.error('Error cargando contactos:', error)
  } finally {
    loading.value = false
  }
}

// Inicialización
onMounted(() => {
  loadContacts()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>


