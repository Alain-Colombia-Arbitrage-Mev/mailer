<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center">
              <div class="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">M</span>
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">Mailer</span>
            </NuxtLink>
          </div>

          <!-- Navegación principal (desktop) -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="isActive('/dashboard') ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <HomeIcon class="h-4 w-4 mr-2" />
              Dashboard
            </NuxtLink>

            <NuxtLink
              to="/contacts"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="isActive('/contacts') ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <UsersIcon class="h-4 w-4 mr-2" />
              Usuarios
            </NuxtLink>

            <NuxtLink
              to="/templates"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="isActive('/templates') ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <DocumentTextIcon class="h-4 w-4 mr-2" />
              Plantillas
            </NuxtLink>

            <NuxtLink
              to="/campaigns"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="isActive('/campaigns') ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <EnvelopeIcon class="h-4 w-4 mr-2" />
              Campañas
            </NuxtLink>

            <NuxtLink
              to="/emails/compose"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="isActive('/emails') ? 'border-b-2 border-blue-500 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <PencilSquareIcon class="h-4 w-4 mr-2" />
              Componer
            </NuxtLink>
          </div>
        </div>

        <!-- Acciones del usuario -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <!-- Notificaciones -->
          <button
            type="button"
            class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BellIcon class="h-6 w-6" />
          </button>

          <!-- Menú de usuario -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </button>

            <!-- Dropdown del usuario -->
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              @click.away="showUserMenu = false"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div class="font-medium">{{ user?.email || 'Usuario' }}</div>
                  <div class="text-xs text-gray-500">Administrador</div>
                </div>
                
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <UserIcon class="h-4 w-4 inline mr-2" />
                  Mi Perfil
                </NuxtLink>
                
                <NuxtLink
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <CogIcon class="h-4 w-4 inline mr-2" />
                  Configuración
                </NuxtLink>
                
                <div class="border-t border-gray-100">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon class="h-4 w-4 inline mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de menú móvil -->
        <div class="sm:hidden flex items-center">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Bars3Icon v-if="!showMobileMenu" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div v-if="showMobileMenu" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/dashboard"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors"
          :class="isActive('/dashboard') ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          <HomeIcon class="h-5 w-5 inline mr-3" />
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/contacts"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors"
          :class="isActive('/contacts') ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          <UsersIcon class="h-5 w-5 inline mr-3" />
          Usuarios
        </NuxtLink>

        <NuxtLink
          to="/templates"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors"
          :class="isActive('/templates') ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          <DocumentTextIcon class="h-5 w-5 inline mr-3" />
          Plantillas
        </NuxtLink>

        <NuxtLink
          to="/campaigns"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors"
          :class="isActive('/campaigns') ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          <EnvelopeIcon class="h-5 w-5 inline mr-3" />
          Campañas
        </NuxtLink>

        <NuxtLink
          to="/emails/compose"
          class="block pl-3 pr-4 py-2 text-base font-medium transition-colors"
          :class="isActive('/emails') ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          <PencilSquareIcon class="h-5 w-5 inline mr-3" />
          Componer
        </NuxtLink>
      </div>

      <!-- Usuario móvil -->
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="text-white font-medium">{{ userInitials }}</span>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.email || 'Usuario' }}</div>
            <div class="text-sm text-gray-500">Administrador</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <NuxtLink
            to="/profile"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Mi Perfil
          </NuxtLink>
          <NuxtLink
            to="/settings"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            Configuración
          </NuxtLink>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  BellIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Composables
const route = useRoute()
const { user, signOut } = useSupabaseMaster()

// Estado
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// Computed
const userInitials = computed(() => {
  if (!user.value?.email) return 'U'
  const email = user.value.email
  return email.charAt(0).toUpperCase()
})

// Métodos
const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  try {
    await signOut()
    showUserMenu.value = false
    showMobileMenu.value = false
    navigateTo('/auth/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Cerrar menús al hacer clic fuera
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
