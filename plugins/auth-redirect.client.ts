export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const router = useRouter()

  // Watch for user authentication changes
  watch(user, (newUser, oldUser) => {
    console.log('🔄 Auth redirect plugin - Usuario cambió:', {
      newUser: newUser ? newUser.email : 'null',
      oldUser: oldUser ? oldUser.email : 'null',
      currentRoute: router.currentRoute.value.path
    })

    // Si el usuario se autentica y está en una página de auth, redirigir al dashboard
    if (newUser && !oldUser) {
      const currentPath = router.currentRoute.value.path
      const authPaths = ['/auth/login', '/auth/callback', '/auth/register-admin', '/']
      
      if (authPaths.includes(currentPath)) {
        console.log('✅ Usuario autenticado, redirigiendo al dashboard desde:', currentPath)
        navigateTo('/dashboard', { replace: true })
      }
    }

    // Si el usuario se desautentica y está en una página protegida, redirigir al login
    if (!newUser && oldUser) {
      const currentPath = router.currentRoute.value.path
      const protectedPaths = ['/dashboard', '/contacts', '/campaigns', '/templates', '/analytics']
      
      if (protectedPaths.some(path => currentPath.startsWith(path))) {
        console.log('❌ Usuario desautenticado, redirigiendo al login desde:', currentPath)
        navigateTo('/auth/login', { replace: true })
      }
    }
  }, { immediate: false }) // No immediate para evitar redirecciones en la carga inicial
})

