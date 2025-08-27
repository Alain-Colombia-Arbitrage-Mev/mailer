import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    console.log('🔧 Debug: Creando usuario administrador...')
    console.log('🔑 Service Key disponible:', !!config.supabaseServiceKey)
    console.log('📧 Admin Email:', config.adminEmail || 'No configurado')
    
    // Usar Service Role Key para operaciones admin
    const supabaseServiceKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Service Role Key no configurada'
      })
    }
    
    const supabaseAdmin = createClient(
      config.public.supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    const adminEmail = config.adminEmail || 'info@be-mindpower.net'
    const adminPassword = config.adminPassword || 'Be-mind.2025+++'
    
    console.log('👤 Creando usuario con Service Role...')
    
    // Crear usuario con Service Role (bypass confirmación de email)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        name: 'Administrador',
        role: 'admin',
        is_admin: true
      }
    })
    
    if (createError) {
      // Si el usuario ya existe, intentar actualizarlo
      if (createError.message.includes('already been registered')) {
        console.log('⚠️ Usuario ya existe, actualizando...')
        
        // Buscar el usuario existente
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
        
        if (listError) {
          throw createError({
            statusCode: 500,
            statusMessage: `Error listando usuarios: ${listError.message}`
          })
        }
        
        const existingUser = existingUsers.users.find(user => user.email === adminEmail)
        
        if (existingUser) {
          console.log('🔄 Actualizando usuario existente...')
          
          const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            {
              password: adminPassword,
              user_metadata: {
                name: 'Administrador',
                role: 'admin',
                is_admin: true
              },
              email_confirm: true
            }
          )
          
          if (updateError) {
            throw createError({
              statusCode: 500,
              statusMessage: `Error actualizando usuario: ${updateError.message}`
            })
          }
          
          return {
            success: true,
            message: 'Usuario administrador actualizado exitosamente',
            user: {
              id: updateData.user.id,
              email: updateData.user.email,
              email_confirmed: updateData.user.email_confirmed_at !== null,
              user_metadata: updateData.user.user_metadata
            }
          }
        }
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: `Error creando usuario: ${createError.message}`
      })
    }
    
    console.log('✅ Usuario administrador creado exitosamente')
    
    return {
      success: true,
      message: 'Usuario administrador creado exitosamente',
      user: {
        id: userData.user.id,
        email: userData.user.email,
        email_confirmed: userData.user.email_confirmed_at !== null,
        user_metadata: userData.user.user_metadata
      }
    }
    
  } catch (error) {
    console.error('💥 Error en create-admin-user:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno: ${error.message}`
    })
  }
})