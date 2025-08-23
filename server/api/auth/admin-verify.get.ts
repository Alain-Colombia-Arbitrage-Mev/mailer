export default defineEventHandler(async (event) => {
  try {
    const sessionCookie = getCookie(event, 'admin-session')
    
    if (!sessionCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No hay sesión activa'
      })
    }

    let session
    try {
      session = JSON.parse(sessionCookie)
    } catch (parseError) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesión inválida'
      })
    }

    // Verificar que la sesión tenga los campos necesarios
    if (!session.id || !session.email || !session.role || session.role !== 'admin') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesión inválida'
      })
    }

    // Verificar que no haya expirado (opcional, ya que la cookie tiene maxAge)
    const loginTime = new Date(session.loginTime)
    const now = new Date()
    const diffHours = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
    
    if (diffHours > 8) {
      // Limpiar cookie expirada
      deleteCookie(event, 'admin-session')
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesión expirada'
      })
    }

    return {
      success: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
        isAdmin: true,
        loginTime: session.loginTime
      }
    }

  } catch (error) {
    console.error('Error verificando sesión admin:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
