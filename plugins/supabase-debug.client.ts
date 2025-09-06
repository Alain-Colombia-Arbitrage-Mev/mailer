/**
 * Plugin para debug de Supabase en el cliente
 */

export default defineNuxtPlugin(() => {
  // Solo en el cliente y en desarrollo/debug
  if (process.client) {
    const config = useRuntimeConfig()
    
    console.log('🔍 Supabase Debug Info:')
    console.log('📍 URL configurada:', config.public.supabaseUrl)
    console.log('📍 Key configurada:', config.public.supabaseAnonKey ? '✅ Existe' : '❌ No existe')
    console.log('📍 Key preview:', config.public.supabaseAnonKey?.substring(0, 30) + '...')
    
    // Verificar si el cliente se puede crear
    try {
      const supabase = useSupabaseClient()
      console.log('✅ Cliente de Supabase creado exitosamente')
      console.log('📍 Cliente URL:', (supabase as any).supabaseUrl)
    } catch (error) {
      console.error('❌ Error creando cliente Supabase:', error)
    }
  }
})
