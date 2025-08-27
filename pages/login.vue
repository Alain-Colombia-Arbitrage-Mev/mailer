<template>
  <!-- Isolated login page with no layout -->
  <div id="login-page" class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo and Branding -->
      <div class="flex justify-center mb-8">
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="text-center">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
          MailPower
        </h1>
        <p class="text-lg text-gray-600 font-medium">Panel de Administración</p>
        <p class="text-sm text-gray-500 mt-2">Acceso restringido para administradores</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="admin-email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email de Administrador
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <input
                id="admin-email"
                v-model="form.email"
                name="admin-email"
                type="email"
                autocomplete="email"
                required
                class="login-input appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
                placeholder="info@be-mindpower.net"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="admin-password" class="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña de Administrador
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <input
                id="admin-password"
                v-model="form.password"
                name="admin-password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="login-input appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
                placeholder="••••••••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="rounded-lg bg-red-50 border border-red-200 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-semibold text-red-800">Acceso Denegado</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ loginError }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="login-submit-btn group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg v-if="!isLoading" class="h-5 w-5 text-blue-300 group-hover:text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="animate-spin h-5 w-5 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Verificando acceso...' : 'Acceder al Panel' }}
            </button>
          </div>
        </form>

        <!-- System Info -->
        <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <h4 class="text-sm font-semibold text-blue-900">Información del Sistema</h4>
          </div>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex items-center">
              <span class="font-medium">Sistema:</span>
              <span class="ml-2">MailPower v2.0</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium">Acceso:</span>
              <span class="ml-2">Solo Administradores</span>
            </div>
            <div class="flex items-center">
              <span class="font-medium">Seguridad:</span>
              <span class="ml-2 flex items-center">
                <svg class="w-3 h-3 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Activa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-500">
        © 2024 Be-Mindpower. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Define page meta to completely isolate this page
definePageMeta({
  layout: false,
  middleware: []
})

// Form data
const form = reactive({
  email: '',
  password: ''
})

// State
const isLoading = ref(false)
const loginError = ref('')
const showPassword = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

// Validation
const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'El email es requerido'
    return false
  }
  
  if (!form.email.includes('@')) {
    errors.email = 'Email inválido'
    return false
  }
  
  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    return false
  }
  
  return true
}

// Login handler - Solo verifica credenciales de administrador
const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    loginError.value = ''
    
    // Verificar credenciales de administrador directamente
    const ADMIN_EMAIL = 'info@be-mindpower.net'
    const ADMIN_PASSWORD = 'mK-d9846MYfOTglD'
    
    if (form.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || 
        form.password !== ADMIN_PASSWORD) {
      loginError.value = 'Credenciales de administrador incorrectas'
      return
    }
    
    // Crear sesión de administrador
    const adminUser = {
      id: 'admin-001',
      email: ADMIN_EMAIL,
      firstName: 'Administrador',
      lastName: 'Sistema',
      username: 'admin',
      role: 'admin',
      verified: true,
      loginTime: new Date().toISOString()
    }
    
    // Guardar en localStorage
    localStorage.setItem('mailpower_user', JSON.stringify(adminUser))
    
    // Redirigir al dashboard
    await navigateTo('/dashboard')
    
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'Error del sistema. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}

// Redirigir si ya está logueado
onMounted(() => {
  if (process.client) {
    const storedUser = localStorage.getItem('mailpower_user')
    if (storedUser) {
      navigateTo('/dashboard')
    }
  }
})

// Set page title
useHead({
  title: 'Acceso Administrador - MailPower',
  bodyAttrs: {
    class: 'login-page-body'
  }
})
</script>

<style scoped>
/* Isolated styles for login page only */
#login-page {
  /* Ensure this page is completely isolated */
  position: relative;
  z-index: 9999;
}

.login-input {
  /* Specific styles for login inputs */
  font-family: inherit;
}

.login-submit-btn {
  /* Specific styles for login button */
  font-family: inherit;
}

/* Ensure no bleeding of styles */
#login-page * {
  box-sizing: border-box;
}
</style>
