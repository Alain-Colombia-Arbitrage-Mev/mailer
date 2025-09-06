/**
 * Endpoint para debug de variables de entorno de Supabase
 * SOLO para desarrollo - remover en producción
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    const envCheck = {
      timestamp: new Date().toISOString(),
      
      // Variables de entorno directas
      rawEnvVars: {
        SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Existe' : '❌ No existe',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Existe' : '❌ No existe',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Existe' : '❌ No existe'
      },
      
      // Variables a través de runtimeConfig
      configVars: {
        publicSupabaseUrl: config.public.supabaseUrl ? '✅ Existe' : '❌ No existe',
        publicSupabaseKey: config.public.supabaseAnonKey ? '✅ Existe' : '❌ No existe',
        privateServiceKey: config.supabaseServiceKey ? '✅ Existe' : '❌ No existe'
      },
      
      // Preview de valores (primeros 30 caracteres)
      previews: {
        url: config.public.supabaseUrl?.substring(0, 50) + '...',
        anonKey: config.public.supabaseAnonKey?.substring(0, 30) + '...',
        serviceKey: config.supabaseServiceKey?.substring(0, 30) + '...'
      },
      
      // Verificación de formato
      validations: {
        urlStartsWithHttps: config.public.supabaseUrl?.startsWith('https://'),
        urlEndsWithSupabase: config.public.supabaseUrl?.includes('.supabase.co'),
        keyIsJWT: config.public.supabaseAnonKey?.startsWith('eyJ'),
        serviceKeyIsJWT: config.supabaseServiceKey?.startsWith('eyJ')
      }
    }
    
    return {
      success: true,
      environment: process.env.NODE_ENV,
      supabaseCheck: envCheck
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
