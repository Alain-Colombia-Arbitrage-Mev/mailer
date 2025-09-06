// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: '2024-04-03',
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],
  
  // Configuración específica del módulo Supabase
  supabase: {
    url: process.env.SUPABASE_URL || 'https://hxmdzhkkuhsetqucbpia.supabase.co',
    key: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI',
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      exclude: ['/']
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    awsAccessKeyId: process.env.SES_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    awsRegion: process.env.SES_REGION || 'us-east-1',
    
    // SMTP Configuration
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFromName: process.env.SMTP_FROM_NAME,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpReplyTo: process.env.SMTP_REPLY_TO,
    
    // Admin credentials (only available on server-side)
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    
    // Supabase service role key (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://hxmdzhkkuhsetqucbpia.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  
  ssr: true,
  
  // Configuración optimizada para Amplify (sin OXC)
  nitro: {
    preset: 'aws-amplify',
    experimental: {
      wasm: false
    },
    rollupConfig: {
      external: ['papaparse']
    },
    // Deshabilitar optimizaciones problemáticas
    minify: false,
    sourceMap: false
  },
  
  // Configuración de build estable
  build: {
    transpile: []
  },
  
  // Deshabilitar optimizaciones experimentales
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false
  },
  
  // Puerto estándar para desarrollo
  devServer: {
    port: 3000
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
  },

  // Configuración de Vite sin OXC
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['papaparse'],
      // Deshabilitar OXC parser/transformer
      esbuildOptions: {
        target: 'es2020'
      }
    },
    ssr: {
      external: ['papaparse']
    },
    // Usar esbuild en lugar de OXC
    esbuild: {
      target: 'es2020',
      minify: true
    },
    // Deshabilitar transformaciones de OXC
    plugins: []
  }
})