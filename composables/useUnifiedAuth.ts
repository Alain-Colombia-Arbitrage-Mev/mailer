/**
 * Composable unificado de autenticación
 * Centraliza toda la lógica de auth en un solo lugar
 */

export const useUnifiedAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()
  
  // Estado reactivo unificado
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => {
    const metadata = user.value?.user_metadata
    return metadata?.is_admin === true && metadata?.role === 'admin'
  })
  
  const isSuperUser = computed(() => {
    return user.value?.email === 'info@be-mindpower.net'
  })

  // Métodos de autenticación
  const signInWithMagicLink = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }
      
      return { success: true }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Primero verificar credenciales con la API
      const response = await $fetch('/api/auth/admin-login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (!response.success) {
        error.value = response.error || 'Login failed'
        return { success: false, error: response.error }
      }
      
      // Si tiene sesión válida de Supabase, establecerla
      if (response.session) {
        await supabase.auth.setSession(response.session)
      }
      
      return { success: true, user: response.user }
    } catch (err: any) {
      const errorMsg = err.data?.statusMessage || err.message || 'Login failed'
      error.value = errorMsg
      return { success: false, error: errorMsg }
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    isLoading.value = true
    
    try {
      // Limpiar sesión de Supabase
      await supabase.auth.signOut()
      
      // Limpiar cualquier sesión local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_bypass_session')
      }
      
      // Redirigir al login
      await router.push('/auth/login')
      
      return { success: true }
    } catch (err: any) {
      console.error('Error signing out:', err)
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    isSuperUser,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Métodos
    signInWithMagicLink,
    signInWithPassword,
    signOut,
    clearError
  }
}