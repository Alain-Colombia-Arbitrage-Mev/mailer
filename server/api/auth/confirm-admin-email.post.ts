import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Crear cliente con service role key para operaciones administrativas
    const supabaseAdmin = createClient(
      'https://hxmdzhkkuhsetqucbpia.supabase.co',
      config.supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgzOTkyMSwiZXhwIjoyMDY0NDE1OTIxfQ.QVJhJZkqX5YzGtYzJZkqX5YzGtYzJZkqX5YzGtYzJZk',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const adminEmail = 'admin@be-mindpower.net'

    console.log('Confirmando email del usuario admin:', adminEmail)

    // Buscar el usuario por email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (getUserError) {
      console.error('Error obteniendo usuarios:', getUserError)
      return {
        success: false,
        message: 'Error obteniendo usuarios',
        error: getUserError.message
      }
    }

    const adminUser = users.users.find(user => user.email === adminEmail)
    
    if (!adminUser) {
      return {
        success: false,
        message: 'Usuario admin no encontrado'
      }
    }

    console.log('Usuario encontrado:', adminUser.id, 'Confirmado:', adminUser.email_confirmed_at)

    // Si ya está confirmado, no hacer nada
    if (adminUser.email_confirmed_at) {
      return {
        success: true,
        message: 'Usuario ya está confirmado',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          confirmed: true
        }
      }
    }

    // Confirmar el email del usuario
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.id,
      {
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('Error confirmando email:', updateError)
      return {
        success: false,
        message: 'Error confirmando email',
        error: updateError.message
      }
    }

    console.log('Email confirmado exitosamente para usuario:', adminUser.id)

    return {
      success: true,
      message: 'Email confirmado exitosamente',
      user: {
        id: updateData.user.id,
        email: updateData.user.email,
        confirmed: true
      }
    }

  } catch (error) {
    console.error('Error en confirmación de email:', error)
    
    return {
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    }
  }
})
