<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  title: 'Mailer Be-Mindpower',
  meta: [
    { name: 'description', content: 'Sistema empresarial completo de email marketing con tracking avanzado' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
  ]
})
</script>
