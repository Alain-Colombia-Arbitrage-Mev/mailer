import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(
      'https://hxmdzhkkuhsetqucbpia.supabase.co',
      config.supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const adminEmail = config.adminEmail
    const adminPassword = config.adminPassword

    console.log('Intentando crear usuario admin:', adminEmail)

    // Crear usuario en Supabase Auth usando admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Administrador',
        is_admin: true
      }
    })

    if (authError) {
      console.error('Error creando usuario en Auth:', authError)
      
      // Si el usuario ya existe, es OK
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        return {
          success: true,
          message: 'Usuario administrador ya existe',
          user: {
            email: adminEmail,
            role: 'admin'
          }
        }
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Error creando usuario: ${authError.message}`
      })
    }

    console.log('Usuario admin creado exitosamente:', authData.user.id)

    return {
      success: true,
      message: 'Usuario administrador creado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'admin'
      }
    }

  } catch (error) {
    console.error('Error en create-admin:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
