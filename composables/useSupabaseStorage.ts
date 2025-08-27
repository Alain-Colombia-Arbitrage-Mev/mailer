/**
 * Composable para manejar archivos con Supabase Storage
 */

export const useSupabaseStorage = () => {
  // Usar cliente con URL correcta forzada
  const { correctSupabaseClient } = useCorrectSupabase()  
  const supabase = correctSupabaseClient
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  // Bucket por defecto para attachments
  const DEFAULT_BUCKET = 'email-attachments'

  /**
   * Subir un archivo individual
   */
  const uploadFile = async (
    file: File, 
    options: {
      bucket?: string
      path?: string
      upsert?: boolean
    } = {}
  ) => {
    isLoading.value = true
    error.value = null
    uploadProgress.value = 0

    try {
      const bucket = options.bucket || DEFAULT_BUCKET
      const fileName = `${Date.now()}-${file.name}`
      const filePath = options.path ? `${options.path}/${fileName}` : fileName

      console.log(`📤 Subiendo archivo: ${file.name} (${formatFileSize(file.size)})`)

      // Verificar límites
      if (file.size > 50 * 1024 * 1024) { // 50MB límite
        throw new Error('El archivo es demasiado grande (máximo 50MB)')
      }

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: options.upsert || true
        })

      if (uploadError) {
        console.error('❌ Error subiendo archivo:', uploadError)
        error.value = uploadError.message
        return { success: false, error: uploadError.message, data: null }
      }

      uploadProgress.value = 100

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      console.log(`✅ Archivo subido exitosamente: ${filePath}`)

      return {
        success: true,
        data: {
          ...data,
          publicUrl: urlData.publicUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        }
      }

    } catch (err: any) {
      console.error('💥 Error subiendo archivo:', err)
      error.value = err.message
      return { success: false, error: err.message, data: null }
    } finally {
      isLoading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Subir múltiples archivos
   */
  const uploadFiles = async (
    files: File[],
    options: {
      bucket?: string
      path?: string
      upsert?: boolean
    } = {}
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const results = []
      let successCount = 0
      let failCount = 0

      console.log(`📤 Subiendo ${files.length} archivos...`)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        uploadProgress.value = Math.round((i / files.length) * 100)

        const result = await uploadFile(file, options)
        results.push({
          file: file.name,
          ...result
        })

        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      uploadProgress.value = 100

      console.log(`✅ Subida completa: ${successCount} exitosos, ${failCount} fallidos`)

      return {
        success: failCount === 0,
        results,
        summary: {
          total: files.length,
          successful: successCount,
          failed: failCount
        }
      }

    } catch (err: any) {
      console.error('💥 Error subiendo archivos:', err)
      error.value = err.message
      return { success: false, error: err.message, results: [] }
    } finally {
      isLoading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Descargar un archivo
   */
  const downloadFile = async (path: string, bucket: string = DEFAULT_BUCKET) => {
    isLoading.value = true
    error.value = null

    try {
      console.log(`📥 Descargando archivo: ${path}`)

      const { data, error: downloadError } = await supabase.storage
        .from(bucket)
        .download(path)

      if (downloadError) {
        console.error('❌ Error descargando archivo:', downloadError)
        error.value = downloadError.message
        return { success: false, error: downloadError.message, data: null }
      }

      console.log(`✅ Archivo descargado: ${path}`)
      return { success: true, data }

    } catch (err: any) {
      console.error('💥 Error descargando archivo:', err)
      error.value = err.message
      return { success: false, error: err.message, data: null }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crear URL firmada para descarga temporal
   */
  const createSignedUrl = async (
    path: string, 
    expiresIn: number = 3600,
    bucket: string = DEFAULT_BUCKET
  ) => {
    try {
      console.log(`🔗 Creando URL firmada: ${path}`)

      const { data, error: urlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (urlError) {
        console.error('❌ Error creando URL firmada:', urlError)
        return { success: false, error: urlError.message, signedUrl: null }
      }

      return { success: true, signedUrl: data.signedUrl }

    } catch (err: any) {
      console.error('💥 Error:', err)
      return { success: false, error: err.message, signedUrl: null }
    }
  }

  /**
   * Listar archivos en un bucket/path
   */
  const listFiles = async (
    path: string = '',
    bucket: string = DEFAULT_BUCKET,
    options: {
      limit?: number
      offset?: number
    } = {}
  ) => {
    isLoading.value = true
    error.value = null

    try {
      console.log(`📋 Listando archivos en: ${bucket}/${path}`)

      const { data, error: listError } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: options.limit || 100,
          offset: options.offset || 0
        })

      if (listError) {
        console.error('❌ Error listando archivos:', listError)
        error.value = listError.message
        return { success: false, error: listError.message, files: [] }
      }

      return { success: true, files: data || [] }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, files: [] }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Eliminar archivo(s)
   */
  const deleteFiles = async (
    paths: string[],
    bucket: string = DEFAULT_BUCKET
  ) => {
    isLoading.value = true
    error.value = null

    try {
      console.log(`🗑️ Eliminando ${paths.length} archivo(s)`)

      const { data, error: deleteError } = await supabase.storage
        .from(bucket)
        .remove(paths)

      if (deleteError) {
        console.error('❌ Error eliminando archivos:', deleteError)
        error.value = deleteError.message
        return { success: false, error: deleteError.message, deleted: [] }
      }

      console.log(`✅ ${data.length} archivo(s) eliminado(s)`)
      return { success: true, deleted: data }

    } catch (err: any) {
      console.error('💥 Error:', err)
      error.value = err.message
      return { success: false, error: err.message, deleted: [] }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crear o verificar que existe un bucket
   */
  const ensureBucket = async (bucketName: string, isPublic: boolean = false) => {
    try {
      // Primero verificar si ya existe
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.find(b => b.name === bucketName)

      if (bucketExists) {
        console.log(`✅ Bucket '${bucketName}' ya existe`)
        return { success: true, exists: true }
      }

      // Crear el bucket
      console.log(`📦 Creando bucket: ${bucketName}`)
      const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        allowedMimeTypes: [
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/*',
          'video/*',
          'audio/*'
        ],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      })

      if (createError) {
        console.error('❌ Error creando bucket:', createError)
        return { success: false, error: createError.message, exists: false }
      }

      console.log(`✅ Bucket '${bucketName}' creado exitosamente`)
      return { success: true, exists: false, data }

    } catch (err: any) {
      console.error('💥 Error:', err)
      return { success: false, error: err.message, exists: false }
    }
  }

  /**
   * Obtener información de un archivo
   */
  const getFileInfo = async (path: string, bucket: string = DEFAULT_BUCKET) => {
    try {
      const { data, error: infoError } = await supabase.storage
        .from(bucket)
        .list('', {
          search: path
        })

      if (infoError) {
        return { success: false, error: infoError.message, info: null }
      }

      const fileInfo = data.find(file => file.name === path.split('/').pop())
      return { success: true, info: fileInfo }

    } catch (err: any) {
      return { success: false, error: err.message, info: null }
    }
  }

  // Utilidad para formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    // Estado
    isLoading: readonly(isLoading),
    error: readonly(error),
    uploadProgress: readonly(uploadProgress),

    // Constantes
    DEFAULT_BUCKET,

    // Métodos de archivo
    uploadFile,
    uploadFiles,
    downloadFile,
    deleteFiles,
    listFiles,
    getFileInfo,

    // Métodos de URL
    createSignedUrl,

    // Métodos de bucket
    ensureBucket,

    // Utilidades
    formatFileSize
  }
}
