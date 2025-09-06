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
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    
    // Supabase service role key (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  
  ssr: true,
  
  // Configuración optimizada para Amplify
  nitro: {
    preset: 'aws-amplify',
    experimental: {
      wasm: false
    },
    rollupConfig: {
      external: ['papaparse']
    }
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

  // Configuración limpia de Vite
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['papaparse']
    },
    ssr: {
      external: ['papaparse']
    }
  }
})