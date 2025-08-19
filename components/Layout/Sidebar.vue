<template>
  <div class="sidebar" :class="{ 'sidebar-hidden': !isOpen }">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 bg-gray-800">
        <h1 class="text-xl font-bold text-white">Mailer Be-Mindpower</h1>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="nav-item"
          :class="isActiveRoute(item.href) ? 'nav-item-active' : 'nav-item-inactive'"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- User section -->
      <div class="flex-shrink-0 p-4 border-t border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon class="w-5 h-5 text-gray-300" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ userDisplayName }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="text-gray-400 hover:text-white p-1 rounded"
            title="Cerrar sesión"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: true
})

const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Contactos', href: '/contacts', icon: UsersIcon },
  { name: 'Campañas', href: '/campaigns', icon: EnvelopeIcon },
  { name: 'Plantillas', href: '/templates', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Configuración', href: '/settings', icon: CogIcon }
]

const isActiveRoute = (href: string) => {
  return route.path.startsWith(href)
}

const userDisplayName = computed(() => {
  if (user.value?.user_metadata?.firstName && user.value?.user_metadata?.lastName) {
    return `${user.value.user_metadata.firstName} ${user.value.user_metadata.lastName}`
  }
  return user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || 'Usuario'
})

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    await navigateTo('/auth/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>
