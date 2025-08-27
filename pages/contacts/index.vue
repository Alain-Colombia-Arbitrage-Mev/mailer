<template>
  <NuxtLayout name="default">
    <div>
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Contactos</h1>
          <p class="mt-2 text-gray-600">Gestiona tu base de datos de usuarios y contactos</p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Contacto
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-xl font-semibold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Verificados</p>
              <p class="text-xl font-semibold text-gray-900">{{ stats.verified }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Pendientes</p>
              <p class="text-xl font-semibold text-gray-900">{{ stats.pending }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Balance Promedio</p>
              <p class="text-xl font-semibold text-gray-900">${{ stats.avgBalance.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contacts Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center px-4 py-2 text-sm text-gray-600">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando contactos...
          </div>
        </div>

        <div v-else-if="contacts.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Sin contactos</h3>
          <p class="mt-1 text-sm text-gray-500">Agrega tu primer contacto para comenzar</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="contact in contacts" :key="contact.idPerson" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-blue-600">
                          {{ getInitials(contact.firstName, contact.lastName) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ contact.firstName }} {{ contact.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ contact.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.CountryBirthday }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ parseFloat(contact.Balance || 0).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getKycStatusClass(contact.kyc_status)"
                  >
                    {{ contact.kyc_status || 'verified' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editContact(contact)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button 
                    @click="deleteContact(contact)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Contact Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showAddModal ? 'Nuevo Contacto' : 'Editar Contacto' }}
          </h3>
          
          <form @submit.prevent="showAddModal ? addContact() : updateContact()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  v-model="contactForm.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input 
                  v-model="contactForm.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="contactForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  v-model="contactForm.username"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
                <select 
                  v-model="contactForm.CountryBirthday"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar país</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Peru">Perú</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select 
                  v-model="contactForm.Gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Other">Otro</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                <input 
                  v-model="contactForm.Balance"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input 
                  v-model="contactForm.birthday"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : (showAddModal ? 'Crear' : 'Actualizar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define page meta with middleware
definePageMeta({
  middleware: 'auth'
})

// Reactive data
const contacts = ref([])
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingContact = ref(null)

// Stats
const stats = ref({
  total: 0,
  verified: 0,
  pending: 0,
  avgBalance: 0
})

// Form data
const contactForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  CountryBirthday: '',
  Gender: '',
  birthday: '',
  Balance: 0,
  kyc_status: 'verified', // Todos los emails USERS son verificados
  kyc_level: 'basic'
})

// Methods
const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return first + last || 'N/A'
}

const getKycStatusClass = (status) => {
  // Todos los usuarios USERS son verificados por defecto
  return 'bg-green-100 text-green-800'
}

const loadContacts = async () => {
  try {
    loading.value = true
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { data, error, count } = await supabase
      .from('USERS')
      .select('*', { count: 'exact' })
      .limit(50)
    
    if (error) {
      console.error('Error loading contacts:', error)
      contacts.value = []
      return
    }
    
    contacts.value = data || []
    await loadStats()
    
  } catch (error) {
    console.error('Error:', error)
    contacts.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    // Total count
    const { count: total } = await supabase
      .from('USERS')
      .select('*', { count: 'exact', head: true })
    
    // Average balance
    const { data: balanceData } = await supabase
      .from('USERS')
      .select('Balance')
      .not('Balance', 'is', null)
    
    const avgBalance = balanceData && balanceData.length > 0 
      ? balanceData.reduce((sum, item) => sum + parseFloat(item.Balance || 0), 0) / balanceData.length
      : 0
    
    stats.value = {
      total: total || 0,
      verified: total || 0, // Todos son verificados
      pending: 0, // Ninguno pendiente
      avgBalance: avgBalance
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    stats.value = {
      total: 0,
      verified: 0,
      pending: 0,
      avgBalance: 0
    }
  }
}

const addContact = async () => {
  try {
    saving.value = true
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    // Set verified status for all new contacts
    contactForm.value.kyc_status = 'verified'
    
    const { data, error } = await supabase
      .from('USERS')
      .insert([contactForm.value])
    
    if (error) {
      console.error('Error adding contact:', error)
      alert('Error al crear el contacto: ' + error.message)
      return
    }
    
    alert('Contacto creado exitosamente')
    closeModal()
    loadContacts()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al crear el contacto')
  } finally {
    saving.value = false
  }
}

const editContact = (contact) => {
  editingContact.value = contact
  contactForm.value = { ...contact }
  showEditModal.value = true
}

const updateContact = async () => {
  try {
    saving.value = true
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    // Ensure verified status
    contactForm.value.kyc_status = 'verified'
    
    const { data, error } = await supabase
      .from('USERS')
      .update(contactForm.value)
      .eq('idPerson', editingContact.value.idPerson)
    
    if (error) {
      console.error('Error updating contact:', error)
      alert('Error al actualizar el contacto: ' + error.message)
      return
    }
    
    alert('Contacto actualizado exitosamente')
    closeModal()
    loadContacts()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al actualizar el contacto')
  } finally {
    saving.value = false
  }
}

const deleteContact = async (contact) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
    return
  }
  
  try {
    const { useSupabase } = await import('~/composables/useSupabase')
    const supabase = useSupabase()
    
    const { error } = await supabase
      .from('USERS')
      .delete()
      .eq('idPerson', contact.idPerson)
    
    if (error) {
      console.error('Error deleting contact:', error)
      alert('Error al eliminar el contacto: ' + error.message)
      return
    }
    
    alert('Contacto eliminado exitosamente')
    loadContacts()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al eliminar el contacto')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingContact.value = null
  contactForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    CountryBirthday: '',
    Gender: '',
    birthday: '',
    Balance: 0,
    kyc_status: 'verified',
    kyc_level: 'basic'
  }
}

onMounted(() => {
  loadContacts()
})

// Set page title
useHead({
  title: 'Contactos - MailPower'
})
</script>