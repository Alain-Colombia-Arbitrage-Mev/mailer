<template>
  <div style="min-height: 100vh; background: #f9fafb; padding: 20px; font-family: monospace;">
    <div style="max-width: 800px; margin: 0 auto;">
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1f2937;">🔧 Diagnóstico del Sistema de Login Admin</h1>
        
        <button 
          @click="runDiagnostic"
          :disabled="isLoading"
          style="background: #3b82f6; color: white; border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer; margin-bottom: 20px; font-weight: 500;"
        >
          {{ isLoading ? 'Ejecutando diagnóstico...' : 'Ejecutar Diagnóstico' }}
        </button>

        <!-- Resultados del diagnóstico -->
        <div v-if="diagnosticResult" style="margin-top: 20px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #374151;">Resultado del Diagnóstico</h2>
          
          <!-- Estado General -->
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827;">📊 Estado General</h3>
            <p><strong>Fecha:</strong> {{ diagnosticResult.debug?.timestamp }}</p>
            <p><strong>Entorno:</strong> {{ diagnosticResult.debug?.environment }}</p>
            <p><strong>Estado:</strong> <span :style="{ color: diagnosticResult.success ? '#059669' : '#dc2626' }">{{ diagnosticResult.success ? '✓ OK' : '✗ Error' }}</span></p>
          </div>

          <!-- Credenciales de Admin -->
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827;">🔑 Credenciales de Admin</h3>
            <p><strong>Email:</strong> {{ diagnosticResult.debug?.adminCredentials?.email }}</p>
            <p><strong>Contraseña:</strong> {{ diagnosticResult.debug?.adminCredentials?.password }}</p>
            <p><strong>Email configurado:</strong> {{ diagnosticResult.debug?.adminCredentials?.emailValue }}</p>
            <p><strong>Longitud contraseña:</strong> {{ diagnosticResult.debug?.adminCredentials?.passwordLength }} caracteres</p>
          </div>

          <!-- Variables de Entorno -->
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827;">🌍 Variables de Entorno</h3>
            <div v-if="diagnosticResult.debug?.environmentVariables">
              <p v-for="(value, key) in diagnosticResult.debug.environmentVariables" :key="key">
                <strong>{{ key }}:</strong> 
                <span :style="{ color: value.includes('✓') ? '#059669' : '#dc2626' }">{{ value }}</span>
              </p>
            </div>
          </div>

          <!-- Configuración de Supabase -->
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827;">🗄️ Configuración de Supabase</h3>
            <div v-if="diagnosticResult.debug?.supabaseConfig">
              <p v-for="(value, key) in diagnosticResult.debug.supabaseConfig" :key="key">
                <strong>{{ key }}:</strong> 
                <span :style="{ color: value.includes('✓') ? '#059669' : '#dc2626' }">{{ value }}</span>
              </p>
            </div>
          </div>

          <!-- Conexión de Supabase -->
          <div v-if="diagnosticResult.debug?.supabaseConnection" style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #111827;">🔌 Conexión de Supabase</h3>
            <p><strong>Estado:</strong> 
              <span :style="{ color: diagnosticResult.debug.supabaseConnection.status.includes('✓') ? '#059669' : '#dc2626' }">
                {{ diagnosticResult.debug.supabaseConnection.status }}
              </span>
            </p>
            <p v-if="diagnosticResult.debug.supabaseConnection.error"><strong>Error:</strong> {{ diagnosticResult.debug.supabaseConnection.error }}</p>
          </div>

          <!-- Error -->
          <div v-if="!diagnosticResult.success" style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; color: #991b1b;">❌ Error</h3>
            <p><strong>Mensaje:</strong> {{ diagnosticResult.error }}</p>
          </div>
        </div>

        <!-- Test de Login -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #374151;">🧪 Prueba de Login</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 5px;">Email:</label>
              <input 
                v-model="testCredentials.email" 
                type="email"
                style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
                placeholder="info@be-mindpower.net"
              />
            </div>
            <div>
              <label style="display: block; font-weight: 500; margin-bottom: 5px;">Contraseña:</label>
              <input 
                v-model="testCredentials.password" 
                type="password"
                style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
                placeholder="Be-mind.2025+++"
              />
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button 
              @click="testBypassLogin"
              :disabled="isTestingLogin"
              style="background: #10b981; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; font-weight: 500;"
            >
              {{ isTestingLogin ? 'Probando...' : 'Probar Bypass Login' }}
            </button>
            <button 
              @click="testSupabaseLogin"
              :disabled="isTestingLogin"
              style="background: #8b5cf6; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; font-weight: 500;"
            >
              {{ isTestingLogin ? 'Probando...' : 'Probar Supabase Login' }}
            </button>
            <button 
              @click="fillDefaults"
              style="background: #6b7280; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; font-weight: 500;"
            >
              Usar Credenciales por Defecto
            </button>
          </div>

          <!-- Resultado del test -->
          <div v-if="testResult" style="padding: 15px; border-radius: 8px; margin-top: 15px;"
               :style="{ background: testResult.success ? '#f0fdf4' : '#fef2f2', border: `1px solid ${testResult.success ? '#bbf7d0' : '#fecaca'}` }">
            <h4 style="font-weight: bold; margin-bottom: 8px;" :style="{ color: testResult.success ? '#166534' : '#991b1b' }">
              {{ testResult.success ? '✅ Prueba Exitosa' : '❌ Prueba Fallida' }}
            </h4>
            <p><strong>Mensaje:</strong> {{ testResult.message || testResult.error }}</p>
            <div v-if="testResult.user">
              <p><strong>Usuario:</strong> {{ testResult.user.email }}</p>
              <p><strong>Rol:</strong> {{ testResult.user.role }}</p>
              <p><strong>Admin:</strong> {{ testResult.user.isAdmin }}</p>
            </div>
            <pre v-if="testResult.fullResponse" style="background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto; margin-top: 10px;">{{ JSON.stringify(testResult.fullResponse, null, 2) }}</pre>
          </div>
        </div>

                  <!-- Gestión de sesiones bypass -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #374151;">🔧 Gestión de Sesiones Bypass</h2>
          
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button 
              @click="checkBypassSession"
              style="background: #6366f1; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; font-weight: 500;"
            >
              Verificar Sesión Bypass
            </button>
            <button 
              @click="clearBypassSession"
              style="background: #dc2626; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; font-weight: 500;"
            >
              Limpiar Sesión Bypass
            </button>
          </div>

          <div v-if="bypassSessionInfo" style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="font-weight: bold; margin-bottom: 8px; color: #111827;">📝 Estado de Sesión Bypass</h4>
            <pre style="background: #ffffff; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">{{ JSON.stringify(bypassSessionInfo, null, 2) }}</pre>
          </div>
        </div>

        <!-- Navegación -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="/auth/admin-login" style="color: #3b82f6; text-decoration: none; margin-right: 20px;">← Volver al Login</a>
          <a href="/dashboard" style="color: #3b82f6; text-decoration: none;">Dashboard →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuración de la página
definePageMeta({
  layout: false
})

// Estado reactivo
const diagnosticResult = ref(null)
const testResult = ref(null)
const bypassSessionInfo = ref(null)
const isLoading = ref(false)
const isTestingLogin = ref(false)

const testCredentials = ref({
  email: 'info@be-mindpower.net',
  password: 'Be-mind.2025+++'
})

// Métodos
const runDiagnostic = async () => {
  isLoading.value = true
  try {
    const result = await $fetch('/api/debug/admin-login-debug')
    diagnosticResult.value = result
  } catch (error) {
    console.error('Error ejecutando diagnóstico:', error)
    diagnosticResult.value = {
      success: false,
      error: 'No se pudo ejecutar el diagnóstico'
    }
  } finally {
    isLoading.value = false
  }
}

const testBypassLogin = async () => {
  isTestingLogin.value = true
  testResult.value = null
  
  try {
    const result = await $fetch('/api/auth/admin-login-bypass', {
      method: 'POST',
      body: {
        email: testCredentials.value.email,
        password: testCredentials.value.password
      }
    })
    
    testResult.value = {
      success: true,
      ...result,
      fullResponse: result
    }
  } catch (error: any) {
    console.error('Error en bypass login:', error)
    testResult.value = {
      success: false,
      error: error.data?.statusMessage || error.statusMessage || error.message || 'Error desconocido',
      fullResponse: error
    }
  } finally {
    isTestingLogin.value = false
  }
}

const testSupabaseLogin = async () => {
  isTestingLogin.value = true
  testResult.value = null
  
  try {
    const result = await $fetch('/api/auth/admin-login', {
      method: 'POST',
      body: {
        email: testCredentials.value.email,
        password: testCredentials.value.password
      }
    })
    
    testResult.value = {
      success: true,
      ...result,
      fullResponse: result
    }
  } catch (error: any) {
    console.error('Error en Supabase login:', error)
    testResult.value = {
      success: false,
      error: error.data?.statusMessage || error.statusMessage || error.message || 'Error desconocido',
      fullResponse: error
    }
  } finally {
    isTestingLogin.value = false
  }
}

const fillDefaults = () => {
  testCredentials.value.email = 'info@be-mindpower.net'
  testCredentials.value.password = 'Be-mind.2025+++'
}

const checkBypassSession = () => {
  if (process.client) {
    const session = localStorage.getItem('admin_bypass_session')
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        const sessionTime = new Date(sessionData.timestamp)
        const now = new Date()
        const diffHours = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60)
        
        bypassSessionInfo.value = {
          exists: true,
          valid: diffHours < 8,
          hoursElapsed: diffHours.toFixed(2),
          data: sessionData
        }
      } catch (error) {
        bypassSessionInfo.value = {
          exists: true,
          valid: false,
          error: 'Error parseando sesión',
          rawData: session
        }
      }
    } else {
      bypassSessionInfo.value = {
        exists: false,
        message: 'No hay sesión bypass en localStorage'
      }
    }
  }
}

const clearBypassSession = () => {
  if (process.client) {
    localStorage.removeItem('admin_bypass_session')
    bypassSessionInfo.value = {
      cleared: true,
      message: 'Sesión bypass eliminada exitosamente'
    }
    
    // Verificar nuevamente después de limpiar
    setTimeout(() => {
      checkBypassSession()
    }, 500)
  }
}

// Ejecutar diagnóstico al cargar
onMounted(() => {
  runDiagnostic()
  checkBypassSession()
})
</script>
