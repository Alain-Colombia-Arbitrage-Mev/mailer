export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    console.log('🔧 DEBUG: Verificando configuración...')
    console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL)
    console.log('🔑 ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '***CONFIGURADA***' : 'NO CONFIGURADA')
    console.log('📍 SUPABASE_URL:', process.env.SUPABASE_URL)
    console.log('🔑 SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***CONFIGURADA***' : 'NO CONFIGURADA')
    
    return {
      success: true,
      message: 'Verificación de configuración',
      config: {
        // Variables desde useRuntimeConfig
        adminEmail: config.adminEmail || 'NO CONFIGURADA',
        adminPasswordSet: !!config.adminPassword,
        supabaseUrl: config.public.supabaseUrl || 'NO CONFIGURADA',
        supabaseServiceKeySet: !!config.supabaseServiceKey,
        
        // Variables desde process.env directamente
        envAdminEmail: process.env.ADMIN_EMAIL || 'NO CONFIGURADA',
        envAdminPasswordSet: !!process.env.ADMIN_PASSWORD,
        envSupabaseUrl: process.env.SUPABASE_URL || 'NO CONFIGURADA',
        envSupabaseServiceKeySet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        
        // Valores hardcoded para comparar
        expectedEmail: 'info@be-mindpower.net',
        expectedPassword: 'Be-mind.2025+++',
        
        // Comparación
        emailMatches: (config.adminEmail || process.env.ADMIN_EMAIL) === 'info@be-mindpower.net',
        passwordMatches: (config.adminPassword || process.env.ADMIN_PASSWORD) === 'Be-mind.2025+++'
      }
    }
    
  } catch (error) {
    console.error('💥 Error verificando config:', error)
    
    return {
      success: false,
      error: error.message,
      config: {
        error: 'No se pudo verificar la configuración'
      }
    }
  }
})