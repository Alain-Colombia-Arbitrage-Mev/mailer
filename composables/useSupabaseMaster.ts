/**
 * COMPOSABLE MAESTRO DE SUPABASE
 * Usa el cliente de Nuxt pero con funciones mejoradas
 */

export const useSupabaseMaster = () => {
  // Usar el cliente oficial de Nuxt
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Verificar que estamos usando la URL correcta
  const config = useRuntimeConfig()
  const CORRECT_URL = 'https://hxmdzhkkuhsetqucbpia.supabase.co'
  
  if (process.client) {
    console.log('🔧 SUPABASE MASTER: Verificando configuración')
    console.log('📍 URL configurada:', config.public.supabaseUrl)
    console.log('📍 URL esperada:', CORRECT_URL)
    
    if (config.public.supabaseUrl !== CORRECT_URL) {
      console.warn('⚠️ URL de Supabase no coincide con la esperada')
    }
  }

  return {
    supabase,
    user,
    
    // Métodos de autenticación
    async sendMagicLink(email: string) {
      console.log('📧 MASTER: Enviando Magic Link a:', email)
      
      try {
        let redirectUrl = 'http://localhost:3000/auth/callback'
        
        if (typeof window !== 'undefined') {
          const currentOrigin = window.location.origin
          redirectUrl = `${currentOrigin}/auth/callback`
          
          if (process.env.NODE_ENV === 'development' && window.location.hostname !== 'localhost') {
            redirectUrl = 'http://localhost:3000/auth/callback'
          }
        }
        
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectUrl }
        })

        if (error) {
          console.error('❌ MASTER: Error enviando Magic Link:', error)
          return { success: false, error: error.message }
        }

        console.log('✅ MASTER: Magic Link enviado exitosamente')
        return { success: true, data }
      } catch (err: any) {
        console.error('💥 MASTER: Error al enviar Magic Link:', err)
        return { success: false, error: err.message }
      }
    },

    async signInWithPassword(email: string, password: string) {
      console.log('🔐 MASTER: Autenticando con contraseña para:', email)
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          console.error('❌ MASTER: Error de autenticación:', error)
          return { success: false, error: error.message }
        }

        console.log('✅ MASTER: Autenticación exitosa')
        console.log('👤 MASTER: Usuario:', data.user?.email)
        
        return { success: true, data, user: data.user, session: data.session }
      } catch (err: any) {
        console.error('💥 MASTER: Error al autenticar:', err)
        return { success: false, error: err.message }
      }
    },

    async signOut() {
      console.log('🚪 MASTER: Cerrando sesión...')
      
      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('❌ MASTER: Error cerrando sesión:', error)
          return { success: false, error: error.message }
        }
        
        console.log('✅ MASTER: Sesión cerrada exitosamente')
        return { success: true }
      } catch (err: any) {
        console.error('💥 MASTER: Error al cerrar sesión:', err)
        return { success: false, error: err.message }
      }
    },

    async testConnection() {
      console.log('🧪 MASTER: Probando conexión...')
      console.log('📍 MASTER: URL configurada:', config.public.supabaseUrl)
      
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .select('id, name')
          .limit(1)

        if (error) {
          console.error('❌ MASTER: Error de conexión:', error)
          return { success: false, error: error.message }
        }

        console.log('✅ MASTER: Conexión exitosa')
        return { success: true, data }
      } catch (err: any) {
        console.error('💥 MASTER: Error al probar conexión:', err)
        return { success: false, error: err.message }
      }
    },

    isSuperUser(email?: string) {
      const userEmail = email || user.value?.email
      return userEmail === 'info@be-mindpower.net'
    },

    verifyConfig() {
      return {
        url: config.public.supabaseUrl,
        keyPreview: config.public.supabaseAnonKey?.substring(0, 30) + '...',
        isCorrect: config.public.supabaseUrl === CORRECT_URL,
        isMaster: true
      }
    }
  }
}
