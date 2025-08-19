<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
             <!-- Header -->
       <div class="text-center">
         <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
           <EnvelopeIcon v-if="authMode === 'magic-link'" class="h-6 w-6 text-blue-600" />
           <ShieldCheckIcon v-else class="h-6 w-6 text-blue-600" />
         </div>
         <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
           {{ authMode === 'magic-link' ? 'Acceso con Magic Link' : 'Acceso de Super Usuario' }}
         </h2>
         <p class="mt-2 text-sm text-gray-600">
           {{ authMode === 'magic-link' 
             ? 'Te enviaremos un enlace seguro a tu email para acceder sin contraseña'
             : 'Acceso directo para administradores con credenciales' }}
         </p>
       </div>

       <!-- Auth Mode Switcher -->
       <div class="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg">
         <button
           @click="switchAuthMode('magic-link')"
           :class="[
             'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
             authMode === 'magic-link'
               ? 'bg-white text-blue-600 shadow-sm'
               : 'text-gray-500 hover:text-gray-700'
           ]"
         >
           <EnvelopeIcon class="h-4 w-4 inline mr-1" />
           Magic Link
         </button>
         <button
           @click="switchAuthMode('password')"
           :class="[
             'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors',
             authMode === 'password'
               ? 'bg-white text-blue-600 shadow-sm'
               : 'text-gray-500 hover:text-gray-700'
           ]"
         >
           <ShieldCheckIcon class="h-4 w-4 inline mr-1" />
           Super Usuario
         </button>
       </div>

      <!-- Success Message -->
      <div v-if="emailSent" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              ¡Enlace enviado!
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>
                Hemos enviado un enlace mágico a <strong>{{ form.email }}</strong>.
                Revisa tu bandeja de entrada y haz clic en el enlace para acceder.
              </p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <button
                  @click="resetForm"
                  class="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  Enviar a otro email
                </button>
                <button
                  @click="resendLink"
                  :disabled="loading || cooldownActive"
                  class="ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600 disabled:opacity-50"
                >
                  {{ cooldownActive ? `Reenviar en ${cooldownTime}s` : 'Reenviar enlace' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <XCircleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error de autenticación
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

             <!-- Login Form -->
       <form v-if="!emailSent" class="mt-8 space-y-6" @submit.prevent="handleAuth">
         <div>
           <label for="email" class="block text-sm font-medium text-gray-700">
             Dirección de email
           </label>
           <div class="mt-1 relative">
             <input
               id="email"
               v-model="form.email"
               name="email"
               type="email"
               autocomplete="email"
               required
               :disabled="loading || (authMode === 'password')"
               class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
               :placeholder="authMode === 'password' ? 'info@be-mindpower.net' : 'tu@email.com'"
             >
             <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
               <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
             </div>
           </div>
         </div>

         <!-- Password field for super user -->
         <div v-if="authMode === 'password'">
           <label for="password" class="block text-sm font-medium text-gray-700">
             Contraseña de Super Usuario
           </label>
           <div class="mt-1 relative">
             <input
               id="password"
               v-model="form.password"
               name="password"
               type="password"
               autocomplete="current-password"
               required
               :disabled="loading"
               class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
               placeholder="Ingresa la contraseña de administrador"
             >
           </div>
         </div>

         <!-- Super User Suggestion -->
         <div v-if="showSuperUserOption && authMode === 'magic-link'" class="rounded-md bg-blue-50 p-4">
           <div class="flex">
             <ShieldCheckIcon class="h-5 w-5 text-blue-400" />
             <div class="ml-3">
               <h3 class="text-sm font-medium text-blue-800">
                 👑 Super Usuario Detectado
               </h3>
               <div class="mt-2 text-sm text-blue-700">
                 <p>Este email pertenece a un super usuario. ¿Prefieres acceder con contraseña?</p>
               </div>
               <div class="mt-3">
                 <button
                   @click="switchAuthMode('password')"
                   type="button"
                   class="text-sm font-medium text-blue-600 hover:text-blue-500"
                 >
                   Cambiar a acceso con contraseña →
                 </button>
               </div>
             </div>
           </div>
         </div>

         <div>
           <button
             type="submit"
             :disabled="(!form.email || loading) || (authMode === 'password' && !form.password)"
             class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
               <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
             </span>
             <PaperAirplaneIcon v-if="authMode === 'magic-link'" class="h-4 w-4 mr-2" />
             <ShieldCheckIcon v-else class="h-4 w-4 mr-2" />
             {{ loading 
               ? (authMode === 'magic-link' ? 'Enviando enlace...' : 'Autenticando...') 
               : (authMode === 'magic-link' ? 'Enviar Magic Link' : 'Acceder como Super Usuario') }}
           </button>
         </div>

         <!-- Info -->
         <div class="text-center">
           <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
             <ShieldCheckIcon class="h-4 w-4" />
             <span>{{ authMode === 'magic-link' ? 'Acceso seguro sin contraseñas' : 'Acceso administrativo seguro' }}</span>
           </div>
         </div>
       </form>

      <!-- Alternative Actions -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">¿Necesitas ayuda?</span>
          </div>
        </div>

                 <div class="mt-6 text-center space-y-2">
           <p class="text-sm text-gray-600">
             ¿No recibes el email?
             <button
               @click="showEmailTips = !showEmailTips"
               class="font-medium text-blue-600 hover:text-blue-500"
             >
               Ver consejos
             </button>
           </p>
           
           <div v-if="showEmailTips" class="text-xs text-gray-500 bg-gray-100 rounded-md p-3 text-left">
             <ul class="space-y-1">
               <li>• Revisa tu carpeta de spam o correo no deseado</li>
               <li>• Asegúrate de que el email esté escrito correctamente</li>
               <li>• El enlace puede tardar unos minutos en llegar</li>
               <li>• Verifica que tu proveedor de email no bloquee emails automáticos</li>
             </ul>
           </div>

           <!-- Admin Registration Link -->
           <div class="pt-4 border-t border-gray-200">
             <p class="text-xs text-gray-500 mb-2">¿Problemas con el super usuario?</p>
             <div class="flex justify-center space-x-4 mb-2">
               <button
                 @click="manualRegisterSuperUser"
                 :disabled="loading"
                 class="text-xs font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50"
               >
                 Crear Super Usuario
               </button>
               <NuxtLink
                 to="/auth/register-admin"
                 class="text-xs font-medium text-purple-600 hover:text-purple-500"
               >
                 Página de Registro
               </NuxtLink>
             </div>
             <!-- Enlaces de debug eliminados -->
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

// Composables
const supabase = useSupabaseClient()
const route = useRoute()

// Solo inicializar en el cliente para evitar errores SSR
const masterAuth = process.client ? useSupabaseMaster() : {
  user: ref(null),
  sendMagicLink: () => Promise.resolve({ success: false, error: 'Cliente no inicializado' }),
  signInWithPassword: () => Promise.resolve({ success: false, error: 'Cliente no inicializado' }),
  testConnection: () => Promise.resolve({ success: false, error: 'Cliente no inicializado' }),
  verifyConfig: () => ({}),
  isSuperUser: () => false
}

const { user, sendMagicLink, signInWithPassword, testConnection, verifyConfig, isSuperUser } = masterAuth

// Redirect if already logged in
watch(user, (newUser, oldUser) => {
  console.log('👀 Watcher del usuario activado:', {
    newUser: newUser?.email || 'null',
    oldUser: oldUser?.email || 'null'
  })
  
  if (newUser && !oldUser) {
    console.log('✅ Usuario detectado por watcher, redirigiendo...')
    navigateTo('/dashboard', { replace: true })
  }
}, { immediate: true })

// State
const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const emailSent = ref(false)
const showEmailTips = ref(false)
const cooldownActive = ref(false)
const cooldownTime = ref(0)
const authMode = ref<'magic-link' | 'password'>('magic-link')
const showSuperUserOption = ref(false)

// Handle URL error parameter
const urlError = route.query.error as string
if (urlError) {
  switch (urlError) {
    case 'invalid_session':
      error.value = 'El enlace ha expirado o es inválido. Solicita uno nuevo.'
      break
    case 'callback_error':
      error.value = 'Error en el proceso de autenticación. Inténtalo de nuevo.'
      break
    default:
      error.value = 'Ha ocurrido un error. Inténtalo de nuevo.'
  }
}

/**
 * Maneja la autenticación (Magic Link o contraseña)
 */
const handleAuth = async () => {
  if (!form.email || loading.value) return
  
  // Validar contraseña si es modo password
  if (authMode.value === 'password' && !form.password) {
    error.value = 'Por favor ingresa la contraseña'
    return
  }
  
  loading.value = true
  error.value = ''

  try {
    // Verificar que estamos usando la URL correcta
    const urlVerification = verifyConfig()
    console.log('🔍 Verificación de URL:', urlVerification)
    
    // La verificación ya no es necesaria porque usamos cliente forzado
    console.log('🔧 Usando cliente forzado con URL:', urlVerification.url)
    
    console.log('🚀 Probando conexión con URL CORRECTA...')
    const connectionTest = await testConnection()
    
    if (!connectionTest.success) {
      console.error('❌ Fallo en test de conexión:', connectionTest.error)
      error.value = `Error de conexión: ${connectionTest.error}`
      return
    }
    
    if (authMode.value === 'magic-link') {
      console.log('✅ Conexión exitosa, enviando Magic Link...')
      const result = await sendMagicLink(form.email)

      if (!result.success) {
        console.error('❌ Error al enviar Magic Link:', result.error)
        error.value = result.error
        return
      }

      console.log('✅ Magic Link enviado exitosamente')
      emailSent.value = true
      startCooldown()
    } else {
      console.log('✅ Conexión exitosa, autenticando con contraseña...')
      const result = await signInWithPassword(form.email, form.password)

      if (!result.success) {
        console.error('❌ Error de autenticación:', result.error)
        error.value = result.error
        return
      }

      console.log('✅ Autenticación exitosa, forzando actualización del estado...')
      
      // Forzar actualización del estado del usuario
      try {
        // Refrescar la sesión para asegurar que el estado se actualice
        await supabase.auth.getSession()
        
        // Esperar un tick para que Vue actualice el estado reactivo
        await nextTick()
        
        console.log('🔄 Estado del usuario después del login:', user.value ? 'Autenticado' : 'No autenticado')
        
        if (user.value) {
          console.log('✅ Usuario confirmado, redirigiendo inmediatamente...')
          await navigateTo('/dashboard', { replace: true })
        } else {
          console.log('⚠️ Usuario no detectado, esperando actualización automática...')
          // Esperar un poco más y verificar de nuevo
          setTimeout(async () => {
            console.log('🔄 Verificación tardía del usuario:', user.value ? 'Autenticado' : 'No autenticado')
            if (user.value) {
              console.log('🔄 Redirección tardía...')
              await navigateTo('/dashboard', { replace: true })
            } else {
              console.error('❌ El usuario no se actualizó correctamente')
              // Forzar recarga de la página como último recurso
              window.location.href = '/dashboard'
            }
          }, 2000)
        }
      } catch (err) {
        console.error('💥 Error actualizando estado:', err)
        // Redirección de emergencia
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      }
    }
  } catch (err: any) {
    console.error('💥 Error capturado:', err)
    error.value = err.message || 'Error en la autenticación'
  } finally {
    loading.value = false
  }
}

// Mantener la función original para compatibilidad
const handleMagicLink = handleAuth

/**
 * Reenvía el enlace mágico
 */
const resendLink = async () => {
  if (cooldownActive.value || loading.value) return
  
  loading.value = true
  error.value = ''

  try {
    console.log('🔄 Reenviando Magic Link con URL CORRECTA...')
    const result = await sendMagicLink(form.email)

    if (!result.success) {
      console.error('❌ Error al reenviar:', result.error)
      error.value = result.error
      return
    }

    console.log('✅ Magic Link reenviado exitosamente')
    startCooldown()
  } catch (err: any) {
    console.error('💥 Error al reenviar:', err)
    error.value = err.message || 'Error al reenviar el enlace'
  } finally {
    loading.value = false
  }
}

/**
 * Inicia el cooldown para reenvío
 */
const startCooldown = () => {
  cooldownActive.value = true
  cooldownTime.value = 60 // 60 segundos
  
  const interval = setInterval(() => {
    cooldownTime.value--
    
    if (cooldownTime.value <= 0) {
      cooldownActive.value = false
      clearInterval(interval)
    }
  }, 1000)
}

/**
 * Resetea el formulario
 */
const resetForm = () => {
  emailSent.value = false
  form.email = ''
  form.password = ''
  error.value = ''
  showEmailTips.value = false
}

/**
 * Cambia el modo de autenticación
 */
const switchAuthMode = (mode: 'magic-link' | 'password') => {
  authMode.value = mode
  error.value = ''
  emailSent.value = false
  form.password = ''
  
  if (mode === 'password') {
    // Pre-llenar con el email del super usuario
    form.email = 'info@be-mindpower.net'
  } else {
    form.email = ''
  }
}

/**
 * Detecta si el email ingresado es del super usuario
 */
watch(() => form.email, (newEmail) => {
  showSuperUserOption.value = isSuperUser(newEmail)
  
  // Si es super usuario y no está en modo password, sugerir cambio
  if (showSuperUserOption.value && authMode.value === 'magic-link') {
    console.log('👑 Email de super usuario detectado')
  }
})

/**
 * Registro manual del super usuario
 */
const manualRegisterSuperUser = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔧 Registro manual de super usuario...')
    const result = await registerSuperUser()
    
    if (!result.success) {
      error.value = `Error en registro: ${result.error}`
      return
    }
    
    console.log('✅ Super usuario registrado manualmente')
    // Mostrar mensaje de éxito temporal
    const originalError = error.value
    error.value = ''
    
    // Crear un mensaje de éxito temporal
    emailSent.value = true
    form.email = 'info@be-mindpower.net'
    
    setTimeout(() => {
      emailSent.value = false
      error.value = originalError
    }, 3000)
    
  } catch (err: any) {
    console.error('💥 Error en registro manual:', err)
    error.value = err.message || 'Error al registrar super usuario'
  } finally {
    loading.value = false
  }
}

/**
 * Debug de configuración de Supabase
 */
const debugSupabaseConfig = () => {
  const config = useRuntimeConfig()
  console.log('🔧 Debug de configuración de Supabase:')
  console.log('📍 SUPABASE_URL:', config.public.supabaseUrl)
  console.log('🔑 SUPABASE_KEY (primeros 20):', config.public.supabaseKey?.substring(0, 20) + '...')
  console.log('🌐 Current Origin:', window.location.origin)
  console.log('🔗 Expected Callback:', `${window.location.origin}/auth/callback`)
  
  // Verificar la configuración del cliente Supabase forzado
  const urlCheck = verifyConfig()
  console.log('✅ Config Verification:', urlCheck)
}

/**
 * Escuchar eventos de cambio de autenticación
 */
const setupAuthListener = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('supabase-auth-change', (event: any) => {
      console.log('🎉 Evento de auth recibido:', event.detail)
      const { user: eventUser } = event.detail
      
      if (eventUser) {
        console.log('🚀 Redirigiendo por evento personalizado...')
        navigateTo('/dashboard', { replace: true })
      }
    })
  }
}

/**
 * Inicialización de la página
 */
onMounted(async () => {
  try {
    // Setup del listener de auth
    setupAuthListener()
    
    // Debug de configuración
    debugSupabaseConfig()
    
    console.log('🚀 Página de login inicializada')
  } catch (error) {
    console.error('Error inicializando página:', error)
  }
})

// Metadata
definePageMeta({
  layout: false,
  auth: false
})

useSeoMeta({
  title: 'Acceso - Mailer Be-Mindpower',
  description: 'Accede con Magic Link o como Super Usuario a Mailer Be-Mindpower'
})
</script>