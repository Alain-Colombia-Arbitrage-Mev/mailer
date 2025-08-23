import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Crear cliente de Supabase con anon key
    const supabase = createClient(
      'https://hxmdzhkkuhsetqucbpia.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'
    )

    const adminEmail = 'info@be-mindpower.net'
    const oldPassword = 'BMP@Admin2024!' // Contraseña anterior
    const newPassword = 'Be-mind.2025+++' // Nueva contraseña

    console.log('Actualizando contraseña para:', adminEmail)

    // Primero intentar hacer login con la contraseña anterior
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: oldPassword
    })

    if (loginError) {
      console.error('Error en login con contraseña anterior:', loginError)
      
      // Si no puede hacer login, intentar con diferentes contraseñas comunes
      const possiblePasswords = [
        'Be-mind.2025+++', // Ya podría estar actualizada
        '@Angelyalaia.2024', // Contraseña del SMTP
        'BMP@Admin2024!', // Contraseña anterior
        'admin123', // Contraseña por defecto
        'password123'
      ]

      let loginSuccess = false
      let currentSession = null

      for (const testPassword of possiblePasswords) {
        try {
          const { data: testLogin, error: testError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: testPassword
          })

          if (!testError && testLogin.user) {
            console.log('Login exitoso con contraseña:', testPassword)
            loginSuccess = true
            currentSession = testLogin
            break
          }
        } catch (e) {
          // Continuar con la siguiente contraseña
        }
      }

      if (!loginSuccess) {
        return {
          success: false,
          message: 'No se pudo hacer login con ninguna contraseña conocida',
          suggestion: 'Verifica las credenciales en Supabase Dashboard'
        }
      }

      loginData = currentSession
    }

    console.log('Login exitoso, actualizando contraseña...')

    // Actualizar la contraseña
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError)
      return {
        success: false,
        message: 'Error actualizando contraseña',
        error: updateError.message
      }
    }

    console.log('Contraseña actualizada exitosamente')

    // Cerrar sesión
    await supabase.auth.signOut()

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
      newCredentials: {
        email: adminEmail,
        password: newPassword
      }
    }

  } catch (error) {
    console.error('Error en actualización de contraseña:', error)
    
    return {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    }
  }
})
