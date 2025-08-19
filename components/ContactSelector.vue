<template>
  <div class="contact-selector">
    <!-- Campo de entrada con dropdown -->
    <div class="relative">
      <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <!-- Contactos seleccionados -->
        <div
          v-for="contact in selectedContacts"
          :key="contact.email"
          class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
        >
          <span>{{ contact.name || contact.email }}</span>
          <button
            @click="removeContact(contact)"
            class="ml-1 text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
        
        <!-- Campo de búsqueda -->
        <input
          ref="searchInput"
          v-model="searchQuery"
          @focus="showDropdown = true"
          @keydown.enter.prevent="addCurrentSearch"
          @keydown.escape="showDropdown = false"
          @keydown.arrow-down.prevent="navigateDown"
          @keydown.arrow-up.prevent="navigateUp"
          type="text"
          placeholder="Buscar contactos por nombre o email..."
          class="flex-1 min-w-[200px] outline-none bg-transparent"
        />
      </div>
      
      <!-- Dropdown con resultados -->
      <div
        v-if="showDropdown && (filteredContacts.length > 0 || searchQuery.length > 0)"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
      >
        <!-- Filtros por etiquetas -->
        <div v-if="availableTags.length > 0" class="p-3 border-b border-gray-200">
          <div class="text-xs font-medium text-gray-700 mb-2">Filtrar por etiquetas:</div>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="tag in availableTags"
              :key="tag.id"
              @click="toggleTagFilter(tag)"
              :class="[
                'px-2 py-1 text-xs rounded-full border transition-colors',
                selectedTagFilters.includes(tag.id)
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              ]"
            >
              {{ tag.name }} ({{ getContactCountByTag(tag.id) }})
            </button>
            <button
              v-if="selectedTagFilters.length > 0"
              @click="clearTagFilters"
              class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-300"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        
        <!-- Lista de contactos -->
        <div class="max-h-60 overflow-y-auto">
          <!-- Opción para agregar email directo -->
          <div
            v-if="searchQuery.includes('@') && !isEmailSelected(searchQuery)"
            @click="addEmailDirect(searchQuery)"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-green-600 text-sm">@</span>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">
                  Agregar "{{ searchQuery }}"
                </div>
                <div class="text-xs text-gray-500">Email directo</div>
              </div>
            </div>
          </div>
          
          <!-- Contactos filtrados -->
          <div
            v-for="(contact, index) in filteredContacts"
            :key="contact.idPerson"
            @click="selectContact(contact)"
            :class="[
              'px-3 py-2 cursor-pointer transition-colors',
              index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-100',
              isContactSelected(contact) ? 'bg-green-50' : ''
            ]"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-gray-600 text-sm">{{ getInitials(contact) }}</span>
              </div>
              <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium text-gray-900">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </div>
                  <div v-if="isContactSelected(contact)" class="text-green-600">
                    ✓
                  </div>
                </div>
                <div class="text-sm text-gray-500">{{ contact.email }}</div>
                <div v-if="contact.tags && contact.tags.length > 0" class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="tag in contact.tags"
                    :key="tag"
                    class="px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensaje cuando no hay resultados -->
          <div
            v-if="filteredContacts.length === 0 && searchQuery.length > 0 && !searchQuery.includes('@')"
            class="px-3 py-4 text-center text-gray-500"
          >
            No se encontraron contactos con "{{ searchQuery }}"
          </div>
        </div>
        
        <!-- Estadísticas -->
        <div v-if="filteredContacts.length > 0" class="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          {{ filteredContacts.length }} contactos encontrados
          <span v-if="selectedTagFilters.length > 0">
            (filtrados por {{ selectedTagFilters.length }} etiqueta{{ selectedTagFilters.length > 1 ? 's' : '' }})
          </span>
        </div>
      </div>
    </div>
    
    <!-- Acciones rápidas -->
    <div v-if="availableTags.length > 0" class="mt-2 flex flex-wrap gap-2">
      <button
        v-for="tag in availableTags.slice(0, 5)"
        :key="tag.id"
        @click="selectAllFromTag(tag)"
        class="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
      >
        Seleccionar todos de "{{ tag.name }}" ({{ getContactCountByTag(tag.id) }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Contact {
  idPerson: number
  firstName?: string
  lastName?: string
  email?: string
  tags?: string[]
}

interface SelectedContact {
  email: string
  name?: string
}

interface Tag {
  id: string
  name: string
}

interface Props {
  modelValue: string[]
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar contactos...'
})

const emit = defineEmits<Emits>()

// Referencias
const searchInput = ref<HTMLInputElement>()
const { supabase } = useSupabaseMaster()

// Estado
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)
const loading = ref(false)

// Datos
const allContacts = ref<Contact[]>([])
const availableTags = ref<Tag[]>([])
const selectedTagFilters = ref<string[]>([])

// Contactos seleccionados
const selectedContacts = ref<SelectedContact[]>([])

// Computed
const filteredContacts = computed(() => {
  let filtered = allContacts.value

  // Filtrar por etiquetas seleccionadas
  if (selectedTagFilters.value.length > 0) {
    filtered = filtered.filter(contact => 
      contact.tags && contact.tags.some(tag => selectedTagFilters.value.includes(tag))
    )
  }

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact => {
      const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.toLowerCase()
      const email = (contact.email || '').toLowerCase()
      return fullName.includes(query) || email.includes(query)
    })
  }

  return filtered.slice(0, 50) // Limitar resultados
})

// Métodos
const loadContacts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('USERS')
      .select('idPerson, firstName, lastName, email')
      .not('email', 'is', null)
      .limit(1000)

    if (error) throw error
    allContacts.value = data || []
  } catch (error) {
    console.error('Error cargando contactos:', error)
  } finally {
    loading.value = false
  }
}

const loadTags = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_lists')
      .select('id, name')
      .order('name')

    if (error) throw error
    availableTags.value = data || []
  } catch (error) {
    console.error('Error cargando etiquetas:', error)
  }
}

const getContactCountByTag = (tagId: string) => {
  return allContacts.value.filter(contact => 
    contact.tags && contact.tags.includes(tagId)
  ).length
}

const getInitials = (contact: Contact) => {
  const first = contact.firstName?.charAt(0) || ''
  const last = contact.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
}

const isContactSelected = (contact: Contact) => {
  return selectedContacts.value.some(selected => selected.email === contact.email)
}

const isEmailSelected = (email: string) => {
  return selectedContacts.value.some(selected => selected.email === email)
}

const selectContact = (contact: Contact) => {
  if (!contact.email) return
  
  if (!isContactSelected(contact)) {
    const newContact: SelectedContact = {
      email: contact.email,
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
    }
    selectedContacts.value.push(newContact)
    updateModelValue()
  }
  
  searchQuery.value = ''
  showDropdown.value = false
}

const addEmailDirect = (email: string) => {
  if (!isEmailSelected(email)) {
    selectedContacts.value.push({ email, name: email })
    updateModelValue()
  }
  
  searchQuery.value = ''
  showDropdown.value = false
}

const removeContact = (contact: SelectedContact) => {
  selectedContacts.value = selectedContacts.value.filter(c => c.email !== contact.email)
  updateModelValue()
}

const addCurrentSearch = () => {
  if (searchQuery.value.includes('@')) {
    addEmailDirect(searchQuery.value)
  } else if (filteredContacts.value.length > 0) {
    selectContact(filteredContacts.value[0])
  }
}

const toggleTagFilter = (tag: Tag) => {
  const index = selectedTagFilters.value.indexOf(tag.id)
  if (index > -1) {
    selectedTagFilters.value.splice(index, 1)
  } else {
    selectedTagFilters.value.push(tag.id)
  }
}

const clearTagFilters = () => {
  selectedTagFilters.value = []
}

const selectAllFromTag = (tag: Tag) => {
  const contactsFromTag = allContacts.value.filter(contact => 
    contact.tags && contact.tags.includes(tag.id) && contact.email
  )
  
  contactsFromTag.forEach(contact => {
    if (!isContactSelected(contact)) {
      selectedContacts.value.push({
        email: contact.email!,
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
      })
    }
  })
  
  updateModelValue()
}

const navigateDown = () => {
  if (highlightedIndex.value < filteredContacts.value.length - 1) {
    highlightedIndex.value++
  }
}

const navigateUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

const updateModelValue = () => {
  const emails = selectedContacts.value.map(contact => contact.email)
  emit('update:modelValue', emails)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  // Sincronizar con el modelo externo
  selectedContacts.value = newValue.map(email => ({
    email,
    name: email
  }))
}, { immediate: true })

// Cerrar dropdown al hacer clic fuera
onMounted(() => {
  loadContacts()
  loadTags()
  
  document.addEventListener('click', (e) => {
    if (!searchInput.value?.contains(e.target as Node)) {
      showDropdown.value = false
    }
  })
})
</script>

<style scoped>
.contact-selector {
  position: relative;
}
</style>


