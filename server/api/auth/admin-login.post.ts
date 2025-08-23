import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email y contraseña son requeridos'
      })
    }

    const config = useRuntimeConfig()
    
    // Verificar que las credenciales coincidan con las configuradas
    if (email !== config.adminEmail || password !== config.adminPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas'
      })
    }

    // Crear cliente de Supabase
    const supabase = createClient(
      'https://hxmdzhkkuhsetqucbpia.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'
    )

    console.log('Intentando login con Supabase:', email)

    // Intentar login con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (authError) {
      console.error('Error de autenticación Supabase:', authError)
      
      // Si el email no está confirmado, permitir login de todos modos para admin
      if (authError.message.includes('Email not confirmed')) {
        console.log('Email no confirmado, pero permitiendo login para admin')
        
        // Para admin, permitimos acceso sin confirmación de email
        // Generamos un token simple para la sesión
        const adminToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')
        
        return {
          success: true,
          message: 'Login exitoso (email no confirmado pero permitido para admin)',
          user: {
            id: 'admin-temp-id',
            email: email,
            name: 'Administrador',
            role: 'admin',
            isAdmin: true
          },
          session: {
            access_token: adminToken,
            user: {
              id: 'admin-temp-id',
              email: email,
              user_metadata: {
                name: 'Administrador',
                role: 'admin',
                is_admin: true
              }
            }
          }
        }
      }
      
      // Si el usuario no existe, intentar registrarlo
      if (authError.message.includes('Invalid login credentials')) {
        console.log('Usuario no existe, intentando registrar...')
        
        try {
          // Registrar usuario con signUp
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                role: 'admin',
                name: 'Administrador',
                is_admin: true
              }
            }
          })

          if (signUpError) {
            console.error('Error en signUp:', signUpError)
            throw createError({
              statusCode: 500,
              statusMessage: `Error registrando usuario: ${signUpError.message}`
            })
          }

          console.log('Usuario registrado exitosamente:', signUpData.user?.id)

          // Si el registro fue exitoso, intentar login nuevamente
          if (signUpData.user) {
            const { data: retryAuthData, error: retryAuthError } = await supabase.auth.signInWithPassword({
              email: email,
              password: password
            })

            if (retryAuthError) {
              console.error('Error en segundo intento de login:', retryAuthError)
              throw createError({
                statusCode: 401,
                statusMessage: `Error en login después de registro: ${retryAuthError.message}`
              })
            }

            return {
              success: true,
              message: 'Usuario registrado y login exitoso',
              user: {
                id: retryAuthData.user.id,
                email: retryAuthData.user.email,
                name: retryAuthData.user.user_metadata?.name || 'Administrador',
                role: 'admin',
                isAdmin: true
              },
              session: retryAuthData.session
            }
          }
        } catch (error) {
          console.error('Error en proceso de registro:', error)
        }
      }

      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas'
      })
    }

    // Verificar que el usuario tenga permisos de administrador
    const userMetadata = authData.user.user_metadata
    if (!userMetadata?.is_admin || userMetadata?.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permisos de administrador'
      })
    }

    console.log('Login exitoso para admin:', authData.user.id)

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: userMetadata?.name || 'Administrador',
        role: 'admin',
        isAdmin: true
      },
      session: authData.session
    }

  } catch (error) {
    console.error('Error en admin login:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
