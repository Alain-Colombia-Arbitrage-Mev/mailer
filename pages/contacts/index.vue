<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 lg:py-6 space-y-4 lg:space-y-0">
      <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              Gestión de Usuarios
              <span class="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {{ realStats.total.toLocaleString() }} usuarios
              </span>
            </h1>
        <p class="mt-1 text-sm text-gray-500">
              Administra tu base de datos de usuarios registrados con etiquetas y categorías
        </p>
      </div>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          @click="showImportModal = true"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
              <ArrowUpTrayIcon class="h-4 w-4 mr-2" />
              <span class="hidden sm:inline">Importar CSV/Excel</span>
              <span class="sm:hidden">Importar</span>
        </button>
            <button
              @click="exportContacts"
              :disabled="getSelectedCount() === 0 && contacts.length === 0"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              <span class="hidden sm:inline">Exportar ({{ getSelectedCount() || contacts.length }})</span>
              <span class="sm:hidden">Exportar</span>
        </button>
            <button
              @click="showNewContactModal = true"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nuevo Usuario
            </button>
      </div>
    </div>
            </div>
            </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <!-- Filtros y Etiquetas -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Búsqueda -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Búsqueda</h3>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar contactos..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
        </div>
      </div>

          <!-- Etiquetas -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-sm font-medium text-gray-900">Etiquetas</h3>
              <button
                @click="showNewTagModal = true"
                class="text-blue-600 hover:text-blue-800"
              >
                <PlusIcon class="h-4 w-4" />
              </button>
            </div>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="selectedTags"
                  value=""
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Todos ({{ realStats.total.toLocaleString() }})</span>
              </label>
              <label
                v-for="tag in tags"
                :key="tag.id"
                class="flex items-center"
              >
                <input
                  v-model="selectedTags"
                  :value="tag.id"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :style="{ backgroundColor: tag.color + '20', color: tag.color }"
                >
                  {{ tag.name }} ({{ getContactCountByTag(tag.id) }})
                </span>
              </label>
        </div>
      </div>

          <!-- Estadísticas -->
          <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Estadísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Usuarios</span>
                <span class="text-sm font-medium">{{ realStats.total.toLocaleString() }}</span>
            </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Con Email</span>
                <span class="text-sm font-medium text-green-600">{{ realStats.withEmail.toLocaleString() }}</span>
            </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Sin Email</span>
                <span class="text-sm font-medium text-yellow-600">{{ realStats.withoutEmail.toLocaleString() }}</span>
          </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Con Balance</span>
                <span class="text-sm font-medium text-blue-600">{{ realStats.withBalance.toLocaleString() }}</span>
        </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Con Teléfono</span>
                <span class="text-sm font-medium text-purple-600">{{ realStats.withPhone.toLocaleString() }}</span>
      </div>
        </div>
      </div>
    </div>

        <!-- Lista de Contactos -->
        <div class="lg:col-span-3">
          <div class="bg-white shadow-sm rounded-xl border border-gray-200">
            <!-- Toolbar -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
              <input
                      data-select-all="true"
                      @change="toggleSelectAll"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">
                      Seleccionar todos ({{ filteredContacts.length }})
                    </span>
                  </label>
                  
                  <div v-if="getSelectedCount() > 0" class="flex items-center space-x-2" data-action-bar>
                    <span class="text-sm text-gray-500" data-selected-count>{{ getSelectedCount() }}</span> seleccionados
                    <button
                      @click="bulkAddTag"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Agregar Etiqueta
                    </button>
                    <button
                      @click="bulkRemoveTag"
                      class="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      Quitar Etiqueta
                    </button>
                    <button
                      @click="sendEmailToSelected"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      📧 Enviar Email
                    </button>
                    <button
                      @click="bulkDelete"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
      </div>
    </div>

          <div class="flex items-center space-x-2">
                  <select
                    v-model="sortBy"
                    class="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    <option value="name">Ordenar por Nombre</option>
                    <option value="email">Ordenar por Email</option>
                    <option value="created_at">Ordenar por Fecha</option>
                    <option value="status">Ordenar por Estado</option>
                  </select>
            <button
                    @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                    class="p-1 text-gray-400 hover:text-gray-600"
            >
                    <ArrowUpIcon v-if="sortOrder === 'asc'" class="h-4 w-4" />
                    <ArrowDownIcon v-else class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

            <!-- Tabla de Contactos -->
      <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
            <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  data-select-all="true"
                  @change="toggleSelectAll"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Etiquetas
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
            </tr>
          </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="contact in paginatedContacts"
                    :key="contact.idPerson"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                <input
                  :data-contact-id="contact.idPerson"
                  @change="toggleContactSelection(contact.idPerson)"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon class="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                            {{ contact.firstName }} {{ contact.lastName }}
                            <span v-if="contact.gender" class="ml-2 text-xs text-gray-400">({{ getGenderLabel(contact.gender) }})</span>
                </div>
                          <div class="text-sm text-gray-500">{{ contact.email }}</div>
                          <div v-if="contact.phone" class="text-sm text-gray-500">📱 {{ contact.phone }}</div>
                          <div v-if="contact.birthday" class="text-sm text-gray-500">🎂 {{ formatDate(contact.birthday) }}</div>
                          <div v-if="contact.balance > 0" class="text-sm text-green-600">💰 ${{ contact.balance }}</div>
                </div>
                </div>
              </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                <span
                        :class="{
                          'bg-green-100 text-green-800': contact.emailVerified,
                          'bg-yellow-100 text-yellow-800': !contact.emailVerified && contact.is_active,
                          'bg-red-100 text-red-800': !contact.is_active
                        }"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ getContactStatus(contact) }}
                </span>
              </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                          v-for="tag in getContactTags(contact.idPerson)"
                    :key="tag.id"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :style="{ backgroundColor: tag.color + '20', color: tag.color }"
                  >
                    {{ tag.name }}
                  </span>
                </div>
              </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(contact.created_at) }}
              </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                  <button
                    @click="editContact(contact)"
                          class="text-blue-600 hover:text-blue-900"
                  >
                          <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                          @click="sendEmailToContact(contact)"
                          class="text-green-600 hover:text-green-900"
                        >
                          <EnvelopeIcon class="h-4 w-4" />
                  </button>
                  <button
                          @click="deleteContact(contact.idPerson)"
                          class="text-red-600 hover:text-red-900"
                  >
                          <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

            <!-- Paginación -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando <span class="font-medium">{{ startIndex }}</span> a <span class="font-medium">{{ endIndex }}</span> de <span class="font-medium">{{ totalContacts.toLocaleString() }}</span> usuarios
                    </p>
                  </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      @click="previousPage"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeftIcon class="h-5 w-5" />
                    </button>
                <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="goToPage(page)"
                      :class="{
                        'bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                        'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                      }"
                      class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      {{ page }}
                </button>
                <button
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRightIcon class="h-5 w-5" />
                </button>
                  </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Modal Nuevo Contacto -->
    <ContactModal
      v-if="showNewContactModal"
      :contact="editingContact"
      :tags="tags"
      @close="showNewContactModal = false; editingContact = null"
      @save="saveContact"
    />

    <!-- Modal Nueva Etiqueta -->
    <TagModal
      v-if="showNewTagModal"
      @close="showNewTagModal = false"
      @save="saveTag"
    />

    <!-- Modal Importar -->
    <ImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @import="handleImport"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Proteger la ruta
definePageMeta({ middleware: 'auth' })

// Composables
const { supabase } = useSupabaseMaster()

// Estado
const contacts = ref([])
const tags = ref([])
const contactTags = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedTags = ref([])
// Array simple sin reactividad para evitar recursión
let selectedContactsArray = []
const sortBy = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalContacts = ref(0)
const selectedStatus = ref('all')
const realStats = ref({
  total: 0,
  withEmail: 0,
  withoutEmail: 0,
  withBalance: 0,
  withPhone: 0
})

const tagCounts = ref({})

// Modales
const showNewContactModal = ref(false)
const showNewTagModal = ref(false)
const showImportModal = ref(false)
const editingContact = ref(null)

// Computed
const filteredContacts = computed(() => {
  let filtered = contacts.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact =>
      contact.firstName?.toLowerCase().includes(query) ||
      contact.lastName?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query)
    )
  }

  // Filtrar por etiquetas
  if (selectedTags.value.length > 0 && !selectedTags.value.includes('')) {
    filtered = filtered.filter(contact => {
      const contactTagIds = getContactTags(contact.idPerson).map(tag => tag.id)
      return selectedTags.value.some(tagId => contactTagIds.includes(tagId))
    })
  }

  // Ordenar
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
        break
      case 'email':
        aValue = a.email?.toLowerCase() || ''
        bValue = b.email?.toLowerCase() || ''
        break
      case 'created_at':
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
        break
      case 'status':
        aValue = getContactStatus(a)
        bValue = getContactStatus(b)
        break
      default:
        aValue = a[sortBy.value]
        bValue = b[sortBy.value]
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
  } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const paginatedContacts = computed(() => {
  // Los datos ya vienen paginados del servidor, no necesitamos slice
  return contacts.value
})

const totalPages = computed(() => {
  return Math.ceil(totalContacts.value / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalContacts.value)
})

// Las estadísticas ahora se cargan directamente desde realStats

// Funciones simples para manejo de selección sin reactividad
const isContactSelected = (contactId) => {
  return selectedContactsArray.includes(contactId)
}

const isAllSelected = () => {
  const currentContacts = contacts.value
  return currentContacts.length > 0 && selectedContactsArray.length === currentContacts.length
}

const getSelectedCount = () => {
  return selectedContactsArray.length
}

// Función para actualizar la UI manualmente
const updateSelectionUI = () => {
  // Forzar actualización de todos los checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-contact-id]')
  checkboxes.forEach(checkbox => {
    const contactId = parseInt(checkbox.getAttribute('data-contact-id'))
    checkbox.checked = selectedContactsArray.includes(contactId)
  })
  
  // Actualizar checkboxes de "seleccionar todos"
  const selectAllCheckboxes = document.querySelectorAll('input[type="checkbox"][data-select-all]')
  selectAllCheckboxes.forEach(checkbox => {
    checkbox.checked = isAllSelected()
  })
  
  // Actualizar contadores
  const counters = document.querySelectorAll('[data-selected-count]')
  counters.forEach(counter => {
    counter.textContent = getSelectedCount()
  })
  
  // Mostrar/ocultar barra de acciones
  const actionBar = document.querySelector('[data-action-bar]')
  if (actionBar) {
    actionBar.style.display = getSelectedCount() > 0 ? 'flex' : 'none'
  }
}

// Métodos
const loadContacts = async () => {
  loading.value = true
  try {
    // Cargar usuarios con paginación para manejar 112.6K registros
    const from = (currentPage.value - 1) * itemsPerPage.value
    const to = from + itemsPerPage.value - 1
    
    let query = supabase
      .from('USERS')
      .select(`
        idPerson,
        firstName,
        lastName,
        email,
        phoneNumber,
        Gender,
        birthday,
        Balance,
        kyc_status,
        kyc_level
      `, { count: 'exact' })
      .range(from, to)
      .order('idPerson', { ascending: false })

    // Aplicar filtros si existen
    if (searchQuery.value.trim()) {
      const search = searchQuery.value.trim()
      query = query.or(`firstName.ilike.%${search}%,lastName.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (selectedStatus.value && selectedStatus.value !== 'all') {
      if (selectedStatus.value === 'with_email') {
        query = query.not('email', 'is', null).neq('email', '')
      } else if (selectedStatus.value === 'without_email') {
        query = query.or('email.is.null,email.eq.')
      } else if (selectedStatus.value === 'with_balance') {
        query = query.gt('Balance', 0)
      }
    }

    const { data, error, count } = await query

    if (error) throw error
    
    // Actualizar total de registros para paginación
    totalContacts.value = count || 0
    
    // Transformar los datos para que coincidan con la interfaz esperada
    contacts.value = (data || []).map(user => ({
      idPerson: user.idPerson,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      company: '', // No disponible en USERS
      position: '', // No disponible en USERS
      notes: '', // No disponible en USERS
      is_active: true, // Asumir activo por defecto
      emailVerified: !!user.email, // Si tiene email, asumir verificado
      created_at: new Date().toISOString(), // Usar fecha actual como fallback
      gender: user.Gender,
      birthday: user.birthday,
      balance: user.Balance || 0,
      kyc_status: user.kyc_status,
      kyc_level: user.kyc_level
    }))
  } catch (error) {
    console.error('Error cargando contactos:', error)
  } finally {
    loading.value = false
  }
}

const loadRealStats = async () => {
  try {
    // Cargar estadísticas reales de toda la base de datos
    const [totalResult, withEmailResult, withBalanceResult, withPhoneResult] = await Promise.all([
      // Total de usuarios
      supabase
        .from('USERS')
        .select('idPerson', { count: 'exact', head: true }),
      
      // Usuarios con email
      supabase
        .from('USERS')
        .select('idPerson', { count: 'exact', head: true })
        .not('email', 'is', null)
        .neq('email', ''),
      
      // Usuarios con balance
      supabase
        .from('USERS')
        .select('idPerson', { count: 'exact', head: true })
        .gt('Balance', 0),
      
      // Usuarios con teléfono
      supabase
        .from('USERS')
        .select('idPerson', { count: 'exact', head: true })
        .not('phoneNumber', 'is', null)
        .neq('phoneNumber', '')
    ])

    if (totalResult.error) throw totalResult.error
    if (withEmailResult.error) throw withEmailResult.error
    if (withBalanceResult.error) throw withBalanceResult.error
    if (withPhoneResult.error) throw withPhoneResult.error

    realStats.value = {
      total: totalResult.count || 0,
      withEmail: withEmailResult.count || 0,
      withoutEmail: (totalResult.count || 0) - (withEmailResult.count || 0),
      withBalance: withBalanceResult.count || 0,
      withPhone: withPhoneResult.count || 0
    }

    // Actualizar también el total para la paginación
    totalContacts.value = realStats.value.total
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

const loadTags = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_lists')
      .select('*')
      .order('name')

    if (error) throw error
    tags.value = data || []
    
    // Cargar conteos reales para cada etiqueta
    await loadTagCounts()
  } catch (error) {
    console.error('Error cargando etiquetas:', error)
  }
}

const loadTagCounts = async () => {
  try {
    // Cargar conteos de todas las etiquetas en paralelo para mejor rendimiento
    const countPromises = tags.value.map(async (tag) => {
      const { count, error } = await supabase
        .from('contact_list_members')
        .select('contact_id', { count: 'exact', head: true })
        .eq('list_id', tag.id)
      
      if (error) {
        console.error(`Error contando etiqueta ${tag.name}:`, error)
        return { tagId: tag.id, count: 0 }
      }
      
      return { tagId: tag.id, count: count || 0 }
    })
    
    const results = await Promise.all(countPromises)
    
    // Convertir resultados a objeto
    const counts = {}
    results.forEach(({ tagId, count }) => {
      counts[tagId] = count
    })
    
    tagCounts.value = counts
  } catch (error) {
    console.error('Error cargando conteos de etiquetas:', error)
  }
}

const getContactCountByTag = (tagId) => {
  return (tagCounts.value[tagId] || 0).toLocaleString()
}

const loadContactTags = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_list_members')
      .select('*')

    if (error) throw error
    contactTags.value = data || []
  } catch (error) {
    console.error('Error cargando relaciones contacto-etiqueta:', error)
  }
}

const getContactTags = (contactId) => {
  const contactTagIds = contactTags.value
    .filter(ct => ct.contact_id === contactId)
    .map(ct => ct.list_id)
  
  return tags.value.filter(tag => contactTagIds.includes(tag.id))
}



const getContactStatus = (contact) => {
  if (!contact.is_active) return 'Inválido'
  if (contact.emailVerified) return 'Verificado'
  return 'Sin Verificar'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getGenderLabel = (gender) => {
  switch (gender) {
    case 'M': return 'Masculino'
    case 'F': return 'Femenino'
    case 'O': return 'Otro'
    default: return gender
  }
}

// Paginación
const goToPage = (page) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// CRUD Contactos
const editContact = (contact) => {
  editingContact.value = { ...contact }
  showNewContactModal.value = true
}

const saveContact = async (contactData) => {
  try {
    // Preparar datos para la tabla USERS
    const userData = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phoneNumber: contactData.phone,
      Gender: contactData.gender || null,
      birthday: contactData.birthday || null
    }

    if (contactData.idPerson) {
      // Actualizar usuario existente
      const { error } = await supabase
        .from('USERS')
        .update(userData)
        .eq('idPerson', contactData.idPerson)
      
      if (error) throw error
      
      const index = contacts.value.findIndex(c => c.idPerson === contactData.idPerson)
      if (index !== -1) {
        contacts.value[index] = { ...contacts.value[index], ...contactData }
      }
    } else {
      // Crear nuevo usuario
      const { data, error } = await supabase
        .from('USERS')
        .insert([userData])
        .select()
      
      if (error) throw error
      if (data && data[0]) {
        // Transformar el nuevo usuario al formato esperado
        const newContact = {
          idPerson: data[0].idPerson,
          firstName: data[0].firstName || '',
          lastName: data[0].lastName || '',
          email: data[0].email || '',
          phone: data[0].phoneNumber || '',
          company: '',
          position: '',
          notes: '',
          is_active: true,
          emailVerified: !!data[0].email,
          created_at: new Date().toISOString(),
          gender: data[0].Gender,
          birthday: data[0].birthday,
          balance: data[0].Balance || 0,
          kyc_status: data[0].kyc_status,
          kyc_level: data[0].kyc_level
        }
        contacts.value.unshift(newContact)
      }
    }
    
    showNewContactModal.value = false
    editingContact.value = null
  } catch (error) {
    console.error('Error guardando contacto:', error)
    alert('Error al guardar el contacto')
  }
}

const deleteContact = async (contactId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
  
  try {
    const { error } = await supabase
      .from('USERS')
      .delete()
      .eq('idPerson', contactId)
    
    if (error) throw error
    
    contacts.value = contacts.value.filter(c => c.idPerson !== contactId)
    const index = selectedContactsArray.indexOf(contactId)
    if (index > -1) {
      selectedContactsArray.splice(index, 1)
      updateSelectionUI()
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    alert('Error al eliminar el usuario')
  }
}

// CRUD Etiquetas
const saveTag = async (tagData) => {
  try {
    const { data, error } = await supabase
      .from('contact_lists')
      .insert([{
        name: tagData.name,
        description: tagData.description,
        color: tagData.color
      }])
      .select()
    
    if (error) throw error
    if (data && data[0]) {
      tags.value.push(data[0])
    }
    
    showNewTagModal.value = false
  } catch (error) {
    console.error('Error guardando etiqueta:', error)
    alert('Error al guardar la etiqueta')
  }
}

// Operaciones masivas
const bulkAddTag = async () => {
  // Implementar modal para seleccionar etiqueta
  // Implementar lógica para agregar etiqueta
}

const bulkRemoveTag = async () => {
  // Implementar modal para seleccionar etiqueta a quitar
  // Implementar lógica para quitar etiqueta
}

const bulkDelete = async () => {
  if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedContactsArray.length} usuarios?`)) return
  
  try {
    const { error } = await supabase
      .from('USERS')
      .delete()
      .in('idPerson', selectedContactsArray)
    
    if (error) throw error
    
    contacts.value = contacts.value.filter(c => !selectedContactsArray.includes(c.idPerson))
    selectedContactsArray.length = 0
    updateSelectionUI()
  } catch (error) {
    console.error('Error eliminando usuarios:', error)
    alert('Error al eliminar los usuarios')
  }
}

// Importar/Exportar
const handleImport = async (importData) => {
  console.log('Importar datos:', importData)
  // Implementar lógica de importación
  await loadContacts()
}

const exportContacts = () => {
  const contactsToExport = selectedContactsArray.length > 0 
    ? contacts.value.filter(c => selectedContactsArray.includes(c.idPerson))
    : contacts.value

  // Crear CSV
  const headers = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Estado', 'Fecha Creación']
  const csvContent = [
    headers.join(','),
    ...contactsToExport.map(contact => [
      contact.firstName || '',
      contact.lastName || '',
      contact.email || '',
      contact.phone || '',
      getContactStatus(contact),
      formatDate(contact.created_at)
    ].join(','))
  ].join('\n')

  // Descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `contactos_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const sendEmailToContact = (contact) => {
  // Redirigir a composer con el contacto pre-seleccionado
  const name = `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Usuario'
  const params = new URLSearchParams({
    to: contact.email,
    name: name
  })
  
  console.log('📧 Redirigiendo a composer con:', { email: contact.email, name })
  navigateTo(`/emails/compose?${params.toString()}`)
}

const toggleContactSelection = (contactId) => {
  const index = selectedContactsArray.indexOf(contactId)
  
  if (index > -1) {
    // Remover si ya está seleccionado
    selectedContactsArray.splice(index, 1)
  } else {
    // Agregar si no está seleccionado
    selectedContactsArray.push(contactId)
  }
  
  // Actualizar UI manualmente
  updateSelectionUI()
  
  console.log('🔍 Contacto toggled:', {
    contactId,
    isNowSelected: selectedContactsArray.includes(contactId),
    totalSelected: selectedContactsArray.length
  })
}

const toggleSelectAll = () => {
  const currentContacts = contacts.value
  const allSelected = isAllSelected()
  
  if (allSelected) {
    // Deseleccionar todos
    selectedContactsArray.length = 0
  } else {
    // Seleccionar todos los contactos actuales
    selectedContactsArray.length = 0 // Limpiar primero
    selectedContactsArray.push(...currentContacts.map(c => c.idPerson))
  }
  
  // Actualizar UI manualmente
  updateSelectionUI()
  
  console.log('🔍 Select all toggled:', {
    allSelected: !allSelected,
    totalSelected: selectedContactsArray.length,
    totalContacts: currentContacts.length
  })
}

const sendEmailToSelected = () => {
  if (selectedContactsArray.length === 0) {
    alert('Selecciona al menos un contacto')
    return
  }
  
  // Obtener emails de contactos seleccionados
  const selectedEmails = contacts.value
    .filter(contact => selectedContactsArray.includes(contact.idPerson))
    .map(contact => contact.email)
    .filter(email => email) // Filtrar emails vacíos
  
  if (selectedEmails.length === 0) {
    alert('Los contactos seleccionados no tienen emails válidos')
    return
  }
  
  // Redirigir a composer con múltiples destinatarios
  const params = new URLSearchParams({
    to: selectedEmails.join(','),
    subject: `Email para ${selectedEmails.length} contactos`
  })
  
  console.log('📧 Redirigiendo a composer con múltiples destinatarios:', selectedEmails)
  navigateTo(`/emails/compose?${params.toString()}`)
}

// Watchers para recargar cuando cambien los filtros
watch([searchQuery, selectedStatus, currentPage], () => {
  loadContacts()
}, { debounce: 300 })

// Inicialización
onMounted(async () => {
  await Promise.all([
    loadRealStats(), // Cargar estadísticas reales primero
    loadContacts(),
    loadTags(),
    loadContactTags()
  ])
})

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(selectedTags, () => {
  currentPage.value = 1
})
</script>