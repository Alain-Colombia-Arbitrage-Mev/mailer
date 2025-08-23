<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Plantillas de Email</h1>
        <p class="mt-1 text-sm text-gray-500">
          Gestiona tus plantillas HTML reutilizables
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/templates/new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Nueva Plantilla
        </NuxtLink>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar plantillas..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            <option value="newsletter">Newsletter</option>
            <option value="promotional">Promocional</option>
            <option value="transactional">Transaccional</option>
            <option value="welcome">Bienvenida</option>
            <option value="follow-up">Seguimiento</option>
            <option value="other">Otro</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Fecha de creación</option>
            <option value="name">Nombre</option>
            <option value="subject">Asunto</option>
            <option value="updated_at">Última modificación</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lista de plantillas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Preview -->
        <div class="h-48 bg-gray-100 relative overflow-hidden">
          <div 
            class="absolute inset-0 p-4 text-xs overflow-hidden"
            v-html="getPreviewContent(template.html_content)"
          ></div>
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-60"></div>
          
          <!-- Badges -->
          <div class="absolute top-2 right-2 flex space-x-1">
            <span
              v-if="template.is_default"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              Por defecto
            </span>
            <span
              :class="{
                'bg-green-100 text-green-800': template.is_active,
                'bg-gray-100 text-gray-800': !template.is_active
              }"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ template.is_active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900 truncate">
              {{ template.name }}
            </h3>
            <div class="flex space-x-1 ml-2">
              <button
                @click="previewTemplate(template)"
                class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Vista previa"
              >
                <EyeIcon class="h-4 w-4" />
              </button>
              <button
                @click="editTemplate(template)"
                class="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Editar"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="duplicateTemplate(template)"
                class="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                title="Duplicar"
              >
                <DocumentDuplicateIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteTemplate(template)"
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Eliminar"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ getPreviewContent(template.html_content) }}
          </p>
          
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span class="capitalize">{{ template.subject || 'Sin asunto' }}</span>
            <span>{{ formatDate(template.created_at) }}</span>
          </div>
          
          <!-- Estado -->
          <div class="flex items-center mt-2">
            <span
              :class="template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              class="px-2 py-1 text-xs rounded-full"
            >
              {{ template.is_active ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredTemplates.length === 0" class="text-center py-12">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay plantillas</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ templates.length === 0 ? 'Comienza creando tu primera plantilla.' : 'No se encontraron plantillas con los filtros aplicados.' }}
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/templates/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Nueva Plantilla
        </NuxtLink>
      </div>
    </div>

    <!-- Modal de vista previa -->
    <div v-if="showPreviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Vista Previa: {{ previewingTemplate?.name }}
          </h3>
          <button
            @click="showPreviewModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <div class="border border-gray-200 rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
          <div v-html="previewingTemplate?.content"></div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-4">
          <button
            @click="showPreviewModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
          <button
            @click="editTemplate(previewingTemplate)"
            class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Proteger la ruta
definePageMeta({ middleware: 'admin' })

// Composables
const { supabase } = useSupabaseMaster()

// Estado
const templates = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortBy = ref('created_at')
const showPreviewModal = ref(false)
const previewingTemplate = ref(null)

// Computed
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.subject?.toLowerCase().includes(query) ||
      template.html_content?.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado (activo/inactivo)
  if (selectedStatus.value) {
    if (selectedStatus.value === 'active') {
      filtered = filtered.filter(template => template.is_active)
    } else if (selectedStatus.value === 'inactive') {
      filtered = filtered.filter(template => !template.is_active)
    }
  }

  // Ordenar
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'subject':
        aValue = a.subject || ''
        bValue = b.subject || ''
        break
      case 'updated_at':
        aValue = new Date(a.updated_at || a.created_at)
        bValue = new Date(b.updated_at || b.created_at)
        break
      default:
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
    }

    if (sortBy.value === 'created_at' || sortBy.value === 'updated_at') {
      return bValue - aValue // Más recientes primero
    } else {
      return aValue > bValue ? 1 : -1
    }
  })

  return filtered
})

// Métodos
const loadTemplates = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    templates.value = data || []
  } catch (error) {
    console.error('Error cargando plantillas:', error)
  } finally {
    loading.value = false
  }
}

const getPreviewContent = (content) => {
  // Verificar que el contenido existe y no es null/undefined
  if (!content || typeof content !== 'string') {
    return 'Sin contenido'
  }
  
  try {
    // Limpiar y truncar el contenido para la vista previa
    const cleanContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, '') // Remover todas las etiquetas HTML
      .trim()
      .substring(0, 500)
    
    return cleanContent + (content.length > 500 ? '...' : '') || 'Sin contenido'
  } catch (error) {
    console.error('Error procesando contenido:', error)
    return 'Error al procesar contenido'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
  showPreviewModal.value = true
}

const editTemplate = (template) => {
  navigateTo(`/templates/new?id=${template.id}`)
}

const duplicateTemplate = async (template) => {
  if (!confirm('¿Duplicar esta plantilla?')) return
  
  try {
    const { error } = await supabase
      .from('email_templates')
      .insert([{
        name: `${template.name} (Copia)`,
        subject: template.subject,
        html_content: template.html_content,
        text_content: template.text_content,
        is_active: false // Las copias empiezan inactivas
      }])
    
    if (error) throw error
    
    await loadTemplates()
    alert('Plantilla duplicada exitosamente')
  } catch (error) {
    console.error('Error duplicando plantilla:', error)
    alert('Error al duplicar la plantilla')
  }
}

const deleteTemplate = async (template) => {
  if (!confirm(`¿Estás seguro de que deseas eliminar la plantilla "${template.name}"?`)) return
  
  try {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', template.id)
    
    if (error) throw error
    
    templates.value = templates.value.filter(t => t.id !== template.id)
    alert('Plantilla eliminada exitosamente')
  } catch (error) {
    console.error('Error eliminando plantilla:', error)
    alert('Error al eliminar la plantilla')
  }
}

// Inicialización
onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

