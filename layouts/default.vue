<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">MailPower</span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/dashboard" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/dashboard' }"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/emails/compose" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/emails') }"
            >
              Componer
            </NuxtLink>
            <NuxtLink 
              to="/contacts" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/contacts') }"
            >
              Contactos
            </NuxtLink>
            <NuxtLink 
              to="/templates" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/templates') }"
            >
              Templates
            </NuxtLink>
            <NuxtLink 
              to="/campaigns" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/campaigns') }"
            >
              Campañas
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-500 relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            <!-- Profile dropdown -->
            <div class="relative" v-if="user">
              <button 
                @click="showUserMenu = !showUserMenu" 
                class="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ getUserInitials() }}</span>
                </div>
                <span class="hidden md:block text-gray-700 font-medium">{{ getUserDisplayName() }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                @click="showUserMenu = false"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ getUserDisplayName() }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
                <div class="border-t border-gray-100"></div>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <!-- Login button if not authenticated -->
            <div v-else>
              <NuxtLink 
                to="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Sesión
              </NuxtLink>
            </div>

            <!-- Mobile menu button -->
            <button 
              @click="showMobileMenu = !showMobileMenu" 
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div class="space-y-1">
            <NuxtLink 
              to="/dashboard" 
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/dashboard' }"
              @click="showMobileMenu = false"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/emails/compose" 
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/emails') }"
              @click="showMobileMenu = false"
            >
              Componer Email
            </NuxtLink>
            <NuxtLink 
              to="/contacts" 
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/contacts') }"
              @click="showMobileMenu = false"
            >
              Contactos
            </NuxtLink>
            <NuxtLink 
              to="/templates" 
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/templates') }"
              @click="showMobileMenu = false"
            >
              Templates
            </NuxtLink>
            <NuxtLink 
              to="/campaigns" 
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              :class="{ 'text-blue-600 bg-blue-50': $route.path.startsWith('/campaigns') }"
              @click="showMobileMenu = false"
            >
              Campañas
            </NuxtLink>
            
            <!-- Mobile user info -->
            <div v-if="user" class="border-t border-gray-200 pt-4 mt-4">
              <div class="px-3 py-2">
                <p class="text-base font-medium text-gray-900">{{ getUserDisplayName() }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-gray-600">
            © 2024 MailPower. Todos los derechos reservados.
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Soporte</a>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Privacidad</a>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const user = ref(null)

// Get current user from localStorage
const getCurrentUser = () => {
  if (process.client) {
    const storedUser = localStorage.getItem('mailpower_user')
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('mailpower_user')
      }
    }
  }
}

// User display helpers
const getUserInitials = () => {
  if (!user.value) return 'U'
  const first = user.value.firstName ? user.value.firstName.charAt(0).toUpperCase() : ''
  const last = user.value.lastName ? user.value.lastName.charAt(0).toUpperCase() : ''
  return first + last || user.value.email.charAt(0).toUpperCase()
}

const getUserDisplayName = () => {
  if (!user.value) return 'Usuario'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email.split('@')[0]
}

// Logout handler
const handleLogout = async () => {
  try {
    user.value = null
    if (process.client) {
      localStorage.removeItem('mailpower_user')
    }
    await navigateTo('/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  getCurrentUser()
  document.addEventListener('click', handleClickOutside)
  
  // Listen for localStorage changes (for multi-tab support)
  window.addEventListener('storage', (e) => {
    if (e.key === 'mailpower_user') {
      getCurrentUser()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>