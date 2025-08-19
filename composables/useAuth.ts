/**
 * Composable de autenticación simplificado
 * Usa useSupabaseAuth como base
 */
export const useAuth = () => {
  const auth = useSupabaseMaster()
  
  // Re-exportar métodos principales con nombres compatibles
  const sendMagicLink = auth.sendMagicLink

  const signOut = auth.signOut

  const isAuthenticated = auth.isAuthenticated

  const getUserProfile = computed(() => {
    const user = auth.currentUser.value
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      emailConfirmed: user.email_confirmed_at !== null,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      userMetadata: user.user_metadata,
      appMetadata: user.app_metadata
    }
  })

  const updateUserMetadata = async (metadata: Record<string, any>) => {
    const supabase = useSupabaseClient()
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al actualizar perfil' }
    }
  }

  const resendConfirmation = async (email: string) => {
    const supabase = useSupabaseClient()
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        message: 'Enlace de confirmación reenviado' 
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al reenviar confirmación' }
    }
  }

  const handleAuthCallback = auth.handleAuthCallback

  const isEmailConfirmed = computed(() => {
    return auth.currentUser.value?.email_confirmed_at !== null
  })

  const isLoading = auth.isLoading
  const authError = auth.authError
  const clearError = auth.clearError

  const initialize = async () => {
    // El cliente de Nuxt maneja la inicialización automáticamente
    return { success: true }
  }

  return {
    // Estado
    user: auth.currentUser,
    isAuthenticated,
    isEmailConfirmed,
    isLoading,
    authError,
    userProfile: getUserProfile,

    // Métodos
    sendMagicLink,
    signOut,
    updateUserMetadata,
    resendConfirmation,
    handleAuthCallback,
    clearError,
    initialize
  }
}
