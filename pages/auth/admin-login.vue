<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e5e7eb; width: 100%; max-width: 400px;">
      <!-- Header -->
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
          <svg style="width: 32px; height: 32px; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h2 style="margin: 24px 0 8px 0; font-size: 30px; font-weight: 800; color: #111827;">Acceso Administrativo</h2>
        <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">Sistema de Email Marketing Be-Mindpower</p>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 14px; font-weight: 500; color: #991b1b; margin-bottom: 8px;">Error de autenticación</div>
        <div style="font-size: 14px; color: #dc2626;">{{ errorMessage }}</div>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 20px;">
          <label for="email" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Email del administrador</label>
          <input
            id="email"
            v-model="loginForm.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            :disabled="isLoading"
            style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; background: white; transition: all 0.2s; box-sizing: border-box;"
            :style="{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'text' }"
            placeholder="Ingresa tu email"
          />
        </div>
        
        <div style="margin-bottom: 20px;">
          <label for="password" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Contraseña</label>
          <input
            id="password"
            v-model="loginForm.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            :disabled="isLoading"
            style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #111827; background: white; transition: all 0.2s; box-sizing: border-box;"
            :style="{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'text' }"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading || !loginForm.email || !loginForm.password"
          style="width: 100%; padding: 12px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;"
          :style="{ 
            opacity: (isLoading || !loginForm.email || !loginForm.password) ? 0.5 : 1, 
            cursor: (isLoading || !loginForm.email || !loginForm.password) ? 'not-allowed' : 'pointer',
            background: (isLoading || !loginForm.email || !loginForm.password) ? '#3b82f6' : '#3b82f6'
          }"
        >
          <div v-if="isLoading" style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 8px;"></div>
          {{ isLoading ? 'Verificando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Información adicional -->
      <div style="text-align: center; margin-top: 20px;">
        <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">Solo administradores autorizados</p>
        <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">El registro público está deshabilitado</p>
      </div>

      <!-- Credenciales por defecto (solo en desarrollo) -->
      <div v-if="isDevelopment" style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-top: 24px;">
        <h4 style="font-size: 14px; font-weight: 500; color: #92400e; margin-bottom: 8px;">Variables de entorno:</h4>
        <p style="font-size: 12px; color: #a16207; margin: 4px 0; text-align: left;"><strong>username_mailer:</strong> info@be-mindpower.net</p>
        <p style="font-size: 12px; color: #a16207; margin: 4px 0; text-align: left;"><strong>password_mailer:</strong> Be-mind.2025+++</p>
        <button 
          @click="fillDevelopmentCredentials"
          style="background: none; border: none; color: #d97706; text-decoration: underline; cursor: pointer; font-size: 12px; margin-top: 8px;"
        >
          Usar credenciales por defecto
        </button>
      </div>

      <!-- Enlace para registrar usuario -->
      <div style="text-align: center; margin-top: 20px;">
        <a href="/register-admin" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
          ¿Primera vez? Registrar usuario admin →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuración de la página
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Composables
const { login, isLoading } = useAdminAuth()

// Estado reactivo
const loginForm = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')

// Computed
const isDevelopment = computed(() => {
  return process.dev || process.env.NODE_ENV === 'development'
})

// Métodos
const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Por favor, completa todos los campos'
    return
  }

  try {
    const result = await login(loginForm.value.email, loginForm.value.password)
    
    if (!result.success) {
      errorMessage.value = result.error || 'Error desconocido'
    }
    // Si es exitoso, el composable se encarga de la redirección
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error de conexión. Intenta nuevamente.'
  }
}

const fillDevelopmentCredentials = () => {
  loginForm.value.email = 'info@be-mindpower.net'
  loginForm.value.password = 'Be-mind.2025+++'
}

// Limpiar errores cuando el usuario empiece a escribir
watch([() => loginForm.value.email, () => loginForm.value.password], () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
})
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

input:focus {
  outline: none;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button:hover:not(:disabled) {
  background: #2563eb !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .login-container {
    padding: 16px !important;
  }
  
  .login-card {
    padding: 24px !important;
  }
}
</style>
