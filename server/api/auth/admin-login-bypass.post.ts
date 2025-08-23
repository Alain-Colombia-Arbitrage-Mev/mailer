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
    
    console.log('Bypass login attempt:', email)
    console.log('Expected email:', config.adminEmail)
    console.log('Expected password:', config.adminPassword)
    
    // Verificar que las credenciales coincidan con las configuradas
    if (email !== config.adminEmail || password !== config.adminPassword) {
      console.log('Credenciales no coinciden')
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciales inválidas'
      })
    }

    console.log('Login bypass exitoso para admin:', email)

    // Generar un token simple para la sesión
    const adminToken = Buffer.from(`${email}:${Date.now()}:admin`).toString('base64')

    return {
      success: true,
      message: 'Login exitoso (bypass mode)',
      user: {
        id: 'admin-bypass-id',
        email: email,
        name: 'Administrador',
        role: 'admin',
        isAdmin: true
      },
      session: {
        access_token: adminToken,
        user: {
          id: 'admin-bypass-id',
          email: email,
          user_metadata: {
            name: 'Administrador',
            role: 'admin',
            is_admin: true
          }
        }
      }
    }

  } catch (error) {
    console.error('Error en admin login bypass:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
