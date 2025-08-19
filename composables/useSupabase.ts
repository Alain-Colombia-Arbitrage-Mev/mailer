// Simple composable that returns the Nuxt Supabase client
export const useSupabase = () => {
  return {
    client: useSupabaseClient(),
    user: useSupabaseUser()
  }
}