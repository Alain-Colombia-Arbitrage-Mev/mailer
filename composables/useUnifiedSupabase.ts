/**
 * Composable unificado de Supabase para evitar conflictos
 * Usa el cliente oficial del módulo @nuxtjs/supabase
 */

export const useUnifiedSupabase = () => {
  // Usar el cliente oficial del módulo
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const config = useRuntimeConfig()
  
  // Verificar que la configuración esté correcta
  const verifyConfig = () => {
    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey
    
    console.log('🔍 Verificando configuración de Supabase:')
    console.log('📍 URL:', url)
    console.log('📍 Key existe:', !!key)
    console.log('📍 Key preview:', key?.substring(0, 30) + '...')
    
    if (!url || !key) {
      console.error('❌ Faltan variables de entorno de Supabase')
      return false
    }
    
    console.log('✅ Configuración de Supabase correcta')
    return true
  }
  
  // Test de conexión simple
  const testConnection = async () => {
    try {
      console.log('🧪 Probando conexión a Supabase...')
      
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name')
        .limit(1)

      if (error) {
        console.error('❌ Error de conexión:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Conexión exitosa a Supabase')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error al probar conexión:', err)
      return { success: false, error: err.message }
    }
  }

  // Métodos de autenticación
  const signInWithPassword = async (email: string, password: string) => {
    try {
      console.log('🔐 Intentando login con email:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Error de autenticación:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Login exitoso')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error en login:', err)
      return { success: false, error: err.message }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error al cerrar sesión:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Sesión cerrada exitosamente')
      return { success: true }
    } catch (err: any) {
      console.error('💥 Error al cerrar sesión:', err)
      return { success: false, error: err.message }
    }
  }

  const getCurrentSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Error obteniendo sesión:', error)
        return { success: false, error: error.message, session: null }
      }

      return { success: true, session }
    } catch (err: any) {
      console.error('💥 Error obteniendo sesión:', err)
      return { success: false, error: err.message, session: null }
    }
  }

  return {
    // Cliente principal
    supabase,
    user,
    
    // Utilidades
    verifyConfig,
    testConnection,
    
    // Métodos de autenticación
    signInWithPassword,
    signOut,
    getCurrentSession
  }
}
