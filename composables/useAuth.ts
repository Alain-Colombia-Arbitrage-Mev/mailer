import { ref, computed, readonly } from 'vue'

// Tipo para el usuario
interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  username: string
  verified: boolean
  loginTime: string
}

// Estado global de autenticación
const user = ref<User | null>(null)
const isLoggedIn = computed(() => !!user.value)
const isLoading = ref(false)

export const useAuth = () => {
  // Inicializar desde localStorage si existe
  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('mailpower_user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('mailpower_user')
        }
      }
    }
  }

  // Login con email/password
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      
      // Verificar en tabla USERS que el email existe
      const { useSupabase } = await import('~/composables/useSupabase')
      const supabase = useSupabase()
      
      const { data: userData, error } = await supabase
        .from('USERS')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()
      
      if (error || !userData) {
        throw new Error('Email no encontrado en el sistema')
      }
      
      // Simular verificación de password (en producción usar hash)
      // Por ahora, cualquier password funciona para usuarios registrados
      
      const authUser: User = {
        id: userData.idPerson,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        verified: true, // Todos los emails USERS son verificados
        loginTime: new Date().toISOString()
      }
      
      user.value = authUser
      
      if (process.client) {
        localStorage.setItem('mailpower_user', JSON.stringify(authUser))
      }
      
      return { success: true, user: authUser }
      
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  // Registro de nuevo usuario
  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    username?: string
  }) => {
    try {
      isLoading.value = true
      
      const { useSupabase } = await import('~/composables/useSupabase')
      const supabase = useSupabase()
      
      // Verificar que el email no existe
      const { data: existingUser } = await supabase
        .from('USERS')
        .select('email')
        .eq('email', userData.email.toLowerCase())
        .single()
      
      if (existingUser) {
        throw new Error('Este email ya está registrado')
      }
      
      // Crear nuevo usuario en tabla USERS
      const { data: newUser, error } = await supabase
        .from('USERS')
        .insert([{
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email.toLowerCase(),
          username: userData.username || userData.email.split('@')[0],
          Balance: 0,
          kyc_status: 'verified', // Todos verificados por defecto
          kyc_level: 'basic'
        }])
        .select()
        .single()
      
      if (error) {
        throw new Error('Error al crear usuario: ' + error.message)
      }
      
      const authUser: User = {
        id: newUser.idPerson,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        verified: true,
        loginTime: new Date().toISOString()
      }
      
      user.value = authUser
      
      if (process.client) {
        localStorage.setItem('mailpower_user', JSON.stringify(authUser))
      }
      
      return { success: true, user: authUser }
      
    } catch (error: any) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    try {
      user.value = null
      
      if (process.client) {
        localStorage.removeItem('mailpower_user')
      }
      
      // Redirigir al login
      await navigateTo('/login')
      
      return { success: true }
      
    } catch (error: any) {
      console.error('Logout error:', error)
      return { 
        success: false, 
        error: error.message || 'Error al cerrar sesión'
      }
    }
  }
  
  // Verificar si requiere autenticación
  const requireAuth = () => {
    if (!isLoggedIn.value) {
      navigateTo('/login')
      return false
    }
    return true
  }
  
  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user.value) return 'U'
    const first = user.value.firstName ? user.value.firstName.charAt(0).toUpperCase() : ''
    const last = user.value.lastName ? user.value.lastName.charAt(0).toUpperCase() : ''
    return first + last || user.value.email.charAt(0).toUpperCase()
  }
  
  // Obtener nombre completo
  const getUserFullName = () => {
    if (!user.value) return 'Usuario'
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email
  }
  
  return {
    user: readonly(user),
    isLoggedIn,
    isLoading: readonly(isLoading),
    login,
    register,
    logout,
    requireAuth,
    initAuth,
    getUserInitials,
    getUserFullName
  }
}
