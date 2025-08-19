// Usar el cliente de Supabase de Nuxt

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export const useFileUpload = () => {
  const supabase = useSupabaseClient()
  const uploading = ref(false)
  const progress = ref<UploadProgress>({ loaded: 0, total: 0, percentage: 0 })
  const error = ref<string | null>(null)

  /**
   * Sube un archivo a Supabase Storage
   */
  const uploadFile = async (
    file: File,
    bucket: string = 'email-attachments',
    folder: string = '',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    uploading.value = true
    error.value = null
    progress.value = { loaded: 0, total: file.size, percentage: 0 }

    try {
      // Generar nombre único para el archivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const fileName = `${timestamp}_${randomString}.${extension}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // Simular progreso (Supabase no proporciona progreso real)
      const progressInterval = setInterval(() => {
        if (progress.value.percentage < 90) {
          progress.value.loaded += file.size * 0.1
          progress.value.percentage = Math.min((progress.value.loaded / progress.value.total) * 100, 90)
          
          if (onProgress) {
            onProgress(progress.value)
          }
        }
      }, 100)

      // Subir archivo
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)

      if (uploadError) {
        error.value = uploadError.message
        return { success: false, error: uploadError.message }
      }

      // Completar progreso
      progress.value = { loaded: file.size, total: file.size, percentage: 100 }
      if (onProgress) {
        onProgress(progress.value)
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      }
    } catch (err: any) {
      error.value = err.message || 'Error al subir archivo'
      return { success: false, error: error.value }
    } finally {
      uploading.value = false
    }
  }

  /**
   * Sube múltiples archivos
   */
  const uploadMultipleFiles = async (
    files: File[],
    bucket: string = 'email-attachments',
    folder: string = '',
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ) => {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const result = await uploadFile(
        file,
        bucket,
        folder,
        onProgress ? (progress) => onProgress(i, progress) : undefined
      )
      results.push(result)
    }

    return results
  }

  /**
   * Elimina un archivo de Supabase Storage
   */
  const deleteFile = async (filePath: string, bucket: string = 'email-attachments') => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (deleteError) {
        error.value = deleteError.message
        return false
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar archivo'
      return false
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  const getPublicUrl = (filePath: string, bucket: string = 'email-attachments') => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  /**
   * Obtiene una URL firmada (temporal) para un archivo privado
   */
  const getSignedUrl = async (filePath: string, expiresIn: number = 3600, bucket: string = 'email-attachments') => {
    try {
      const { data, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

      if (signError) {
        error.value = signError.message
        return null
      }

      return data.signedUrl
    } catch (err: any) {
      error.value = err.message || 'Error al generar URL firmada'
      return null
    }
  }

  /**
   * Valida un archivo antes de subirlo
   */
  const validateFile = (file: File, options: {
    maxSize?: number // en bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB por defecto
      allowedTypes = [],
      allowedExtensions = []
    } = options

    // Validar tamaño
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(maxSize)}`
      }
    }

    // Validar tipo MIME
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      }
    }

    // Validar extensión
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          valid: false,
          error: `Extensión no permitida. Extensiones permitidas: ${allowedExtensions.join(', ')}`
        }
      }
    }

    return { valid: true }
  }

  /**
   * Procesa archivos desde un input file o drag & drop
   */
  const processFiles = (fileList: FileList | File[], validationOptions?: Parameters<typeof validateFile>[1]) => {
    const files = Array.from(fileList)
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      if (validationOptions) {
        const validation = validateFile(file, validationOptions)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          return
        }
      }
      validFiles.push(file)
    })

    return { validFiles, errors }
  }

  /**
   * Formatea el tamaño de archivo para mostrar
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Obtiene el icono apropiado para un tipo de archivo
   */
  const getFileIcon = (fileName: string, mimeType?: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    // Iconos por extensión
    const iconMap: Record<string, string> = {
      // Documentos
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📄',
      rtf: '📄',
      
      // Hojas de cálculo
      xls: '📊',
      xlsx: '📊',
      csv: '📊',
      
      // Presentaciones
      ppt: '📽️',
      pptx: '📽️',
      
      // Imágenes
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      svg: '🖼️',
      webp: '🖼️',
      
      // Audio
      mp3: '🎵',
      wav: '🎵',
      ogg: '🎵',
      
      // Video
      mp4: '🎬',
      avi: '🎬',
      mov: '🎬',
      wmv: '🎬',
      
      // Archivos comprimidos
      zip: '🗜️',
      rar: '🗜️',
      '7z': '🗜️',
      tar: '🗜️',
      gz: '🗜️'
    }

    return iconMap[extension || ''] || '📎'
  }

  return {
    uploading: readonly(uploading),
    progress: readonly(progress),
    error: readonly(error),
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getPublicUrl,
    getSignedUrl,
    validateFile,
    processFiles,
    formatFileSize,
    getFileIcon
  }
}

/**
 * Composable específico para adjuntos de email
 */
export const useEmailAttachments = () => {
  const { uploadFile, deleteFile, validateFile, formatFileSize, getFileIcon } = useFileUpload()
  const { supabase } = useSupabase()

  const attachments = ref<Array<{
    id?: string
    file?: File
    name: string
    size: number
    type: string
    url?: string
    path?: string
    uploading?: boolean
    uploaded?: boolean
    error?: string
  }>>([])

  /**
   * Agrega archivos como adjuntos
   */
  const addAttachments = (files: File[]) => {
    const validationOptions = {
      maxSize: 25 * 1024 * 1024, // 25MB (límite de SES)
      allowedTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip'
      ]
    }

    files.forEach(file => {
      const validation = validateFile(file, validationOptions)
      
      attachments.value.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploading: false,
        uploaded: false,
        error: validation.valid ? undefined : validation.error
      })
    })
  }

  /**
   * Sube todos los adjuntos pendientes
   */
  const uploadAttachments = async (campaignId: string) => {
    const results = []

    for (let i = 0; i < attachments.value.length; i++) {
      const attachment = attachments.value[i]
      
      if (!attachment.file || attachment.uploaded || attachment.error) {
        continue
      }

      attachment.uploading = true

      try {
        const result = await uploadFile(
          attachment.file,
          'email-attachments',
          `campaigns/${campaignId}`
        )

        if (result.success) {
          // Guardar en la base de datos
          const { data, error } = await supabase
            .from('email_attachments')
            .insert({
              campaign_id: campaignId,
              filename: attachment.name,
              file_path: result.path!,
              file_size: attachment.size,
              mime_type: attachment.type
            })
            .select()
            .single()

          if (error) {
            attachment.error = error.message
          } else {
            attachment.id = data.id
            attachment.url = result.url
            attachment.path = result.path
            attachment.uploaded = true
          }
        } else {
          attachment.error = result.error
        }

        results.push({
          name: attachment.name,
          success: result.success,
          error: result.error
        })
      } catch (error: any) {
        attachment.error = error.message
        results.push({
          name: attachment.name,
          success: false,
          error: error.message
        })
      } finally {
        attachment.uploading = false
      }
    }

    return results
  }

  /**
   * Elimina un adjunto
   */
  const removeAttachment = async (index: number) => {
    const attachment = attachments.value[index]
    
    if (attachment.uploaded && attachment.path) {
      await deleteFile(attachment.path)
      
      if (attachment.id) {
        await supabase
          .from('email_attachments')
          .delete()
          .eq('id', attachment.id)
      }
    }

    attachments.value.splice(index, 1)
  }

  /**
   * Limpia todos los adjuntos
   */
  const clearAttachments = () => {
    attachments.value = []
  }

  /**
   * Obtiene el tamaño total de los adjuntos
   */
  const getTotalSize = computed(() => {
    return attachments.value.reduce((total, attachment) => total + attachment.size, 0)
  })

  /**
   * Verifica si hay adjuntos válidos
   */
  const hasValidAttachments = computed(() => {
    return attachments.value.some(attachment => !attachment.error)
  })

  return {
    attachments,
    addAttachments,
    uploadAttachments,
    removeAttachment,
    clearAttachments,
    getTotalSize,
    hasValidAttachments,
    formatFileSize,
    getFileIcon
  }
}
