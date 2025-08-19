<template>
  <header ref="headerRef" class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between px-4 py-4">
      <!-- Left side -->
      <div class="flex items-center space-x-4">
        <!-- Mobile menu button -->
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <!-- Breadcrumbs -->
        <nav class="breadcrumb" v-if="breadcrumbs.length > 0">
          <NuxtLink
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            :to="crumb.href"
            class="breadcrumb-item"
            :class="{ 'text-gray-900 font-medium': index === breadcrumbs.length - 1 }"
          >
            {{ crumb.name }}
            <ChevronRightIcon
              v-if="index < breadcrumbs.length - 1"
              class="w-4 h-4 mx-2 breadcrumb-separator"
            />
          </NuxtLink>
        </nav>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="relative" v-if="showSearch">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Buscar..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <!-- Notifications -->
        <button
          @click="toggleNotifications"
          class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <BellIcon class="w-6 h-6" />
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
          ></span>
        </button>

        <!-- Quick actions -->
        <div class="relative">
          <button
            @click="toggleQuickActions"
            class="btn btn-primary btn-sm"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Nuevo
            <ChevronDownIcon class="w-4 h-4 ml-2" />
          </button>

          <!-- Quick actions dropdown -->
          <div
            v-if="showQuickActions"
            class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div class="py-1">
              <NuxtLink
                v-for="action in quickActions"
                :key="action.name"
                :to="action.href"
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showQuickActions = false"
              >
                <component :is="action.icon" class="w-4 h-4 mr-3 text-gray-400" />
                {{ action.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications panel -->
    <div
      v-if="showNotifications"
      class="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-3">Notificaciones</h3>
        <div class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="flex items-start space-x-3 p-3 rounded-lg"
            :class="notification.read ? 'bg-gray-50' : 'bg-blue-50'"
          >
            <div class="flex-shrink-0">
              <component
                :is="getNotificationIcon(notification.type)"
                class="w-5 h-5"
                :class="getNotificationIconColor(notification.type)"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-500">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatTime(notification.created_at) }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-blue-600 hover:text-blue-500">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  Bars3Icon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
  ChevronDownIcon,
  UsersIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

interface Breadcrumb {
  name: string
  href: string
}

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  read: boolean
  created_at: string
}

interface Props {
  breadcrumbs?: Breadcrumb[]
  showSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  breadcrumbs: () => [],
  showSearch: true
})

const emit = defineEmits<{
  'toggle-sidebar': []
  'search': [query: string]
}>()

// State
const searchQuery = ref('')
const showQuickActions = ref(false)
const showNotifications = ref(false)
const unreadNotifications = ref(3)

// Mock notifications
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'success',
    title: 'Campaña enviada',
    message: 'La campaña "Newsletter Marzo" se envió exitosamente a 1,234 contactos',
    read: false,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'warning',
    title: 'Tasa de apertura baja',
    message: 'La campaña "Promoción Especial" tiene una tasa de apertura del 12%',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    type: 'info',
    title: 'Nuevos contactos',
    message: '25 nuevos contactos se agregaron hoy',
    read: true,
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
])

const quickActions = [
  { name: 'Nueva Campaña', href: '/campaigns/new', icon: EnvelopeIcon },
  { name: 'Nuevo Contacto', href: '/contacts/new', icon: UsersIcon },
  { name: 'Nueva Plantilla', href: '/templates/new', icon: DocumentTextIcon }
]

// Methods
const handleSearch = useDebounceFn(() => {
  emit('search', searchQuery.value)
}, 300)

const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showQuickActions.value = false
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'error':
      return ExclamationTriangleIcon
    default:
      return InformationCircleIcon
  }
}

const getNotificationIconColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-blue-500'
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Hace un momento'
  if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`
  return date.toLocaleDateString()
}

// Close dropdowns when clicking outside
const headerRef = ref(null)
onClickOutside(headerRef, () => {
  showQuickActions.value = false
  showNotifications.value = false
})
</script>
