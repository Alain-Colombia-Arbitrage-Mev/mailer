// Sistema simple de manejo de sesión
export interface UserSession {
  user: {
    id: string
    email: string
    name: string
    role: string
    isAdmin: boolean
  }
  session: {
    access_token: string
    user: any
  }
  timestamp: number
}

export const AuthSession = {
  // Guardar sesión en localStorage
  save(sessionData: UserSession) {
    try {
      sessionData.timestamp = Date.now()
      localStorage.setItem('admin_session', JSON.stringify(sessionData))
      console.log('✅ Sesión guardada en localStorage')
    } catch (error) {
      console.error('❌ Error guardando sesión:', error)
    }
  },

  // Obtener sesión activa
  get(): UserSession | null {
    try {
      const sessionStr = localStorage.getItem('admin_session')
      if (!sessionStr) return null

      const session = JSON.parse(sessionStr)
      
      // Verificar que la sesión no haya expirado (24 horas)
      const now = Date.now()
      const sessionAge = now - (session.timestamp || 0)
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas en ms
      
      if (sessionAge > maxAge) {
        console.log('🕒 Sesión expirada, eliminando...')
        this.clear()
        return null
      }

      return session
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error)
      this.clear()
      return null
    }
  },

  // Verificar si hay sesión activa
  isAuthenticated(): boolean {
    const session = this.get()
    return session !== null && session.user && session.user.isAdmin
  },

  // Limpiar sesión
  clear() {
    localStorage.removeItem('admin_session')
    console.log('🗑️ Sesión eliminada')
  },

  // Obtener usuario actual
  getUser() {
    const session = this.get()
    return session?.user || null
  },

  // Verificar rol de administrador
  isAdmin(): boolean {
    const user = this.getUser()
    return user?.isAdmin === true && user?.role === 'admin'
  }
}