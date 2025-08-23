export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    supabaseUrl: 'https://hxmdzhkkuhsetqucbpia.supabase.co',
    hasServiceKey: !!config.supabaseServiceKey,
    serviceKeyPreview: config.supabaseServiceKey ? config.supabaseServiceKey.substring(0, 50) + '...' : 'No configurado',
    adminEmail: config.adminEmail,
    adminPasswordSet: !!config.adminPassword
  }
})

