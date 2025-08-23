export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Verificar configuración de runtime
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      adminCredentials: {
        email: config.adminEmail ? '✓ Configurado' : '✗ No configurado',
        password: config.adminPassword ? '✓ Configurado' : '✗ No configurado',
        emailValue: config.adminEmail || 'undefined',
        passwordLength: config.adminPassword ? config.adminPassword.length : 0
      },
      supabaseConfig: {
        url: config.public.supabaseUrl ? '✓ Configurado' : '✗ No configurado',
        anonKey: config.public.supabaseAnonKey ? '✓ Configurado' : '✗ No configurado',
        serviceKey: config.supabaseServiceKey ? '✓ Configurado' : '✗ No configurado'
      },
      environmentVariables: {
        username_mailer: process.env.username_mailer ? '✓ Existe' : '✗ No existe',
        password_mailer: process.env.password_mailer ? '✓ Existe' : '✗ No existe',
        SUPABASE_URL: process.env.SUPABASE_URL ? '✓ Existe' : '✗ No existe',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✓ Existe' : '✗ No existe'
      }
    }

    // Probar conexión con Supabase si está configurado
    if (config.public.supabaseUrl && config.public.supabaseAnonKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          config.public.supabaseUrl,
          config.public.supabaseAnonKey
        )
        
        // Probar conexión
        const { data, error } = await supabase.auth.getSession()
        debugInfo.supabaseConnection = {
          status: error ? '✗ Error' : '✓ Conectado',
          error: error?.message || null
        }
      } catch (supabaseError: any) {
        debugInfo.supabaseConnection = {
          status: '✗ Error de conexión',
          error: supabaseError.message
        }
      }
    }

    return {
      success: true,
      debug: debugInfo
    }
    
  } catch (error: any) {
    console.error('Error en debug admin login:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
