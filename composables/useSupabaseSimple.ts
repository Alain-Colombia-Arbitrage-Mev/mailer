import { createClient } from '@supabase/supabase-js'

export const useSupabaseSimple = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl || 'https://hxmdzhkkuhsetqucbpia.supabase.co',
    config.public.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'
  )

  return {
    supabase,
    
    async signInWithPassword(email: string, password: string) {
      return await supabase.auth.signInWithPassword({ email, password })
    },
    
    async signOut() {
      return await supabase.auth.signOut()
    },
    
    async getSession() {
      return await supabase.auth.getSession()
    }
  }
}