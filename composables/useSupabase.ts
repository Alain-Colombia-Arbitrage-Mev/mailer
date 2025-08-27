import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  // Usar valores directos para evitar problemas con auto-imports
  const supabase = createClient(
    'https://hxmdzhkkuhsetqucbpia.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI'
  )
  
  // Return supabase directly instead of wrapped in object
  return supabase
}

// Composable para usuario mock (ya que no hay autenticación real)
export const useUser = () => {
  return {
    user: {
      id: 'admin-user',
      email: 'info@be-mindpower.net',
      name: 'Administrador',
      role: 'admin'
    }
  }
}

// Composable para uploads de archivos
export const useFileUpload = () => {
  const uploadFile = async (file: File, bucket = 'attachments') => {
    try {
      const supabase = useSupabase()
      const fileName = `${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
        
      if (error) throw error
      
      return {
        success: true,
        data,
        fileName,
        url: `https://hxmdzhkkuhsetqucbpia.supabase.co/storage/v1/object/public/${bucket}/${fileName}`
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  return { uploadFile }
}