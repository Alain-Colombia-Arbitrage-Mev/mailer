// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    
    // SMTP Configuration
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFromName: process.env.SMTP_FROM_NAME,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpReplyTo: process.env.SMTP_REPLY_TO,
    
    // Admin credentials (only available on server-side)
    adminEmail: process.env.ADMIN_EMAIL || 'info@be-mindpower.net',
    adminPassword: process.env.ADMIN_PASSWORD || 'mK-d9846MYfOTglD',
    
    // Supabase service role key (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://hxmdzhkkuhsetqucbpia.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI',
      baseUrl: process.env.BASE_URL || 'http://localhost:3001'
    }
  },
  
  supabase: {
    // DESACTIVAR TODAS LAS REDIRECCIONES AUTOMÁTICAS
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false
    }
  },
  
  ssr: true,
  
  // Puerto configurado en 3001 según BASE_URL
  devServer: {
    port: 3001
  },
  
  // Asegurar que los auto-imports funcionen correctamente
  imports: {
    autoImport: true
  },
  
  app: {
    head: {
      title: 'Mailer Be-Mindpower',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema empresarial completo de email marketing con tracking avanzado' }
      ]
    }
  }
})