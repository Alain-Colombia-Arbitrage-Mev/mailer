/**
 * Composable simplificado para autenticación con Supabase
 * Usa el cliente oficial de Nuxt para mantener sincronización
 */
export const useSupabaseAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  /**
   * Enviar Magic Link
   */
  const sendMagicLink = async (email: string) => {
    console.log('📧 Enviando Magic Link a:', email)
    
    try {
      // Determinar URL de redirección basada en el entorno
      let redirectUrl = 'http://localhost:3000/auth/callback'
      
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin
        redirectUrl = `${currentOrigin}/auth/callback`
        
        // En desarrollo, forzar localhost
        if (process.env.NODE_ENV === 'development' && window.location.hostname !== 'localhost') {
          redirectUrl = 'http://localhost:3000/auth/callback'
          console.warn('⚠️ Forzando redirección a localhost en desarrollo')
        }
      }
      
      console.log('🔗 URL de redirección:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        console.error('❌ Error enviando Magic Link:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Magic Link enviado exitosamente')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error al enviar Magic Link:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Autenticación con contraseña
   */
  const signInWithPassword = async (email: string, password: string) => {
    console.log('🔐 Autenticando con contraseña para:', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Error de autenticación:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Autenticación exitosa')
      console.log('👤 Usuario:', data.user?.email)
      
      return { success: true, data, user: data.user, session: data.session }
    } catch (err: any) {
      console.error('💥 Error al autenticar:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Registrar usuario con contraseña
   */
  const signUpWithPassword = async (email: string, password: string) => {
    console.log('📝 Registrando usuario:', email)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback'
        }
      })

      if (error) {
        console.error('❌ Error en registro:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Usuario registrado exitosamente')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error al registrar:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Cerrar sesión
   */
  const signOut = async () => {
    console.log('🚪 Cerrando sesión...')
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error cerrando sesión:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Sesión cerrada exitosamente')
      return { success: true }
    } catch (err: any) {
      console.error('💥 Error al cerrar sesión:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Verificar si es super usuario
   */
  const isSuperUser = (email?: string) => {
    const userEmail = email || user.value?.email
    return userEmail === 'info@be-mindpower.net'
  }

  /**
   * Obtener sesión actual
   */
  const getCurrentSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Error obteniendo sesión:', error)
        return { success: false, error: error.message }
      }
      
      return { success: true, session }
    } catch (err: any) {
      console.error('💥 Error al obtener sesión:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Verificar URL correcta de Supabase
   */
  const verifyCorrectUrl = () => {
    const config = useRuntimeConfig()
    const expectedUrl = 'https://hxmdzhkkuhsetqucbpia.supabase.co'
    const currentUrl = config.public.supabaseUrl
    
    const isCorrect = currentUrl === expectedUrl
    
    console.log('🔍 Verificación de URL de Supabase:')
    console.log('📍 URL esperada:', expectedUrl)
    console.log('📍 URL actual:', currentUrl)
    console.log('📍 URL del cliente:', (supabase as any).supabaseUrl)
    console.log('✅ ¿Es correcta?', isCorrect)
    
    return {
      isCorrect,
      expectedUrl,
      currentUrl,
      clientUrl: (supabase as any).supabaseUrl,
      keyPreview: config.public.supabaseAnonKey?.substring(0, 30) + '...'
    }
  }

  /**
   * Test de conexión
   */
  const testConnection = async () => {
    console.log('🧪 Probando conexión a Supabase...')
    
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name')
        .limit(1)

      if (error) {
        console.error('❌ Error de conexión:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Conexión exitosa')
      return { success: true, data }
    } catch (err: any) {
      console.error('💥 Error al probar conexión:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    // Cliente y usuario
    supabase,
    user,
    
    // Métodos de autenticación
    sendMagicLink,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    
    // Utilidades
    isSuperUser,
    getCurrentSession,
    verifyCorrectUrl,
    testConnection
  }
}