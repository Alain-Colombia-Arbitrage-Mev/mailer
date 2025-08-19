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
    smtpHost: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUsername: process.env.SMTP_USERNAME || 'info@be-mindpower.net',
    smtpPassword: process.env.SMTP_PASSWORD || '@Angelyalaia.2024',
    smtpFromName: process.env.SMTP_FROM_NAME || 'BMP Support',
    smtpFromEmail: process.env.SMTP_FROM_EMAIL || 'info@be-mindpower.net',
    smtpReplyTo: process.env.SMTP_REPLY_TO || 'info@be-mindpower.net',
    
    // Public keys (exposed to client-side) - URL CORRECTA FORZADA
    public: {
      supabaseUrl: 'https://hxmdzhkkuhsetqucbpia.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  
  supabase: {
    // URL CORRECTA FORZADA - NO usar variables de entorno
    url: 'https://hxmdzhkkuhsetqucbpia.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI',
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/auth/*', '/']
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  },
  
  ssr: true,
  
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