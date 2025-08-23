export default defineEventHandler(async (event) => {
  try {
    // Eliminar la cookie de sesión
    deleteCookie(event, 'admin-session')

    return {
      success: true,
      message: 'Logout exitoso'
    }

  } catch (error) {
    console.error('Error en admin logout:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
