import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Crear cliente de Supabase con anon key
    const supabase = createClient(
      'https://hxmdzhkkuhsetqucbpia.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'
    )

    const adminEmail = 'info@be-mindpower.net'
    const adminPassword = 'Be-mind.2025+++'

    console.log('Registrando usuario admin manualmente:', adminEmail)

    // Registrar usuario con signUp (sin confirmación de email)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: undefined, // No redirect
        data: {
          role: 'admin',
          name: 'Administrador',
          is_admin: true
        }
      }
    })

    if (signUpError) {
      console.error('Error en signUp:', signUpError)
      
      // Si el usuario ya existe, intentar hacer login para verificar
      if (signUpError.message.includes('User already registered')) {
        console.log('Usuario ya existe, verificando login...')
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        })

        if (loginError) {
          return {
            success: false,
            message: 'Usuario ya existe pero las credenciales no coinciden',
            error: loginError.message
          }
        }

        return {
          success: true,
          message: 'Usuario ya existe y las credenciales son correctas',
          user: {
            id: loginData.user.id,
            email: loginData.user.email,
            metadata: loginData.user.user_metadata
          }
        }
      }

      return {
        success: false,
        message: 'Error registrando usuario',
        error: signUpError.message
      }
    }

    console.log('Usuario registrado exitosamente:', signUpData.user?.id)

    return {
      success: true,
      message: 'Usuario admin registrado exitosamente',
      user: {
        id: signUpData.user?.id,
        email: signUpData.user?.email,
        metadata: signUpData.user?.user_metadata
      },
      needsConfirmation: !signUpData.user?.email_confirmed_at
    }

  } catch (error) {
    console.error('Error en registro manual:', error)
    
    return {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    }
  }
})
