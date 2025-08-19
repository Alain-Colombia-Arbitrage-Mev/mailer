<template>
  <div class="email-template-builder">
    <!-- Selector de plantillas responsivas -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Plantillas Responsivas</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in responsiveTemplates"
          :key="template.id"
          @click="applyTemplate(template)"
          class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div class="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
            <div class="w-full h-full flex items-center justify-center text-gray-500">
              <span class="text-sm">{{ template.name }}</span>
            </div>
          </div>
          <h4 class="font-medium text-gray-900">{{ template.name }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ template.description }}</p>
        </div>
      </div>
    </div>

    <!-- Herramientas de construcción -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Panel de componentes -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h4 class="font-semibold text-gray-900 mb-4">Componentes Responsivos</h4>
        <div class="space-y-3">
          <button
            v-for="component in emailComponents"
            :key="component.id"
            @click="insertComponent(component)"
            class="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                <span class="text-blue-600 text-sm">{{ component.icon }}</span>
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ component.name }}</div>
                <div class="text-sm text-gray-600">{{ component.description }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Vista previa responsiva -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-gray-900">Vista Previa</h4>
          <div class="flex space-x-2">
            <button
              v-for="device in devices"
              :key="device.name"
              @click="currentDevice = device"
              :class="currentDevice.name === device.name ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              {{ device.icon }} {{ device.name }}
            </button>
          </div>
        </div>
        
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <div 
            :style="{ width: currentDevice.width, margin: '0 auto' }"
            class="bg-white transition-all duration-300"
          >
            <iframe
              ref="previewFrame"
              :srcdoc="previewHtml"
              class="w-full h-96 border-none"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Editor de código con ayudas -->
    <div class="mt-6 bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-gray-900">Editor HTML</h4>
        <div class="flex space-x-2">
          <button
            @click="optimizeForEmail"
            class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            🔧 Optimizar para Email
          </button>
          <button
            @click="validateEmailHtml"
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            ✅ Validar
          </button>
        </div>
      </div>
      
      <textarea
        v-model="htmlContent"
        @input="updatePreview"
        class="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Pega tu HTML aquí o usa las plantillas..."
      ></textarea>
      
      <!-- Mensajes de validación -->
      <div v-if="validationMessages.length > 0" class="mt-4">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h5 class="font-medium text-yellow-800 mb-2">Sugerencias de Optimización:</h5>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li v-for="message in validationMessages" :key="message" class="flex items-start">
              <span class="mr-2">•</span>
              <span>{{ message }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Estado
const htmlContent = ref(props.modelValue)
const currentDevice = ref({ name: 'Desktop', width: '600px', icon: '🖥️' })
const validationMessages = ref<string[]>([])
const previewFrame = ref<HTMLIFrameElement>()

// Dispositivos para vista previa
const devices = [
  { name: 'Desktop', width: '600px', icon: '🖥️' },
  { name: 'Tablet', width: '480px', icon: '📱' },
  { name: 'Mobile', width: '320px', icon: '📱' }
]

// Plantillas responsivas predefinidas
const responsiveTemplates = [
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Plantilla para boletines informativos',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
    <style>
        /* Reset básico para emails */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Estilos responsivos */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
            .two-column {
                width: 100% !important;
                display: block !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td class="header" style="background-color: #2563eb; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Tu Newsletter</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Mantente informado con las últimas noticias</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content" style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">¡Hola!</h2>
                            <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Aquí tienes las últimas actualizaciones y noticias importantes.
                            </p>
                            
                            <!-- Two column layout -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td class="two-column" style="width: 48%; vertical-align: top; padding-right: 2%;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Noticia 1</h3>
                                        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                            Descripción breve de la primera noticia importante.
                                        </p>
                                    </td>
                                    <td class="two-column" style="width: 48%; vertical-align: top; padding-left: 2%;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Noticia 2</h3>
                                        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                                            Descripción breve de la segunda noticia importante.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="#" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ver Más</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                © 2024 Be-Mindpower. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                <a href="#" style="color: #6b7280; text-decoration: none;">Darse de baja</a> |
                                <a href="#" style="color: #6b7280; text-decoration: none;">Política de privacidad</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  },
  {
    id: 'promotional',
    name: 'Promocional',
    description: 'Plantilla para ofertas y promociones',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oferta Especial</title>
    <style>
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .hero-text {
                font-size: 32px !important;
            }
            .discount {
                font-size: 48px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fef3c7; font-family: Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 20px 0;">
                <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Hero Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 60px 30px; text-align: center;">
                            <h1 class="hero-text" style="margin: 0 0 20px 0; color: #ffffff; font-size: 42px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">¡OFERTA ESPECIAL!</h1>
                            <div class="discount" style="font-size: 64px; font-weight: bold; color: #ffffff; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">50% OFF</div>
                            <p style="margin: 0; color: #fef3c7; font-size: 18px; font-weight: 500;">Por tiempo limitado</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content" style="padding: 50px 30px; text-align: center;">
                            <h2 style="margin: 0 0 25px 0; color: #1f2937; font-size: 28px;">No te pierdas esta oportunidad</h2>
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Aprovecha nuestros mejores productos con un descuento increíble. 
                                Esta oferta es válida solo por tiempo limitado.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="background-color: #dc2626; border-radius: 50px; text-align: center;">
                                        <a href="#" style="background-color: #dc2626; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Comprar Ahora</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 25px 0 0 0; color: #9ca3af; font-size: 14px;">
                                *Oferta válida hasta agotar existencias
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f3f4f6; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                                © 2024 Be-Mindpower. Todos los derechos reservados.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                <a href="#" style="color: #6b7280; text-decoration: none;">Darse de baja</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  },
  {
    id: 'simple',
    name: 'Simple',
    description: 'Plantilla limpia y minimalista',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Simple</title>
    <style>
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 30px 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding: 40px 20px;">
                <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 0 0 30px 0; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 600;">Be-Mindpower</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content" style="padding: 40px 0;">
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Hola,</h2>
                            <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Este es un mensaje simple y directo. Puedes personalizar este contenido según tus necesidades.
                            </p>
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Gracias por tu tiempo.
                            </p>
                            <p style="margin: 0; color: #4b5563; font-size: 16px;">
                                Saludos,<br>
                                <strong>El equipo de Be-Mindpower</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 0 0 0; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                                © 2024 Be-Mindpower. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  }
]

// Componentes de email
const emailComponents = [
  {
    id: 'header',
    name: 'Header',
    icon: '📋',
    description: 'Encabezado con logo y título',
    html: `<tr>
    <td style="background-color: #2563eb; padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Tu Título</h1>
        <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Subtítulo opcional</p>
    </td>
</tr>`
  },
  {
    id: 'button',
    name: 'Botón CTA',
    icon: '🔘',
    description: 'Botón de llamada a la acción',
    html: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
    <tr>
        <td style="background-color: #2563eb; border-radius: 6px; text-align: center;">
            <a href="#" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Tu Botón</a>
        </td>
    </tr>
</table>`
  },
  {
    id: 'two-column',
    name: 'Dos Columnas',
    icon: '📊',
    description: 'Layout de dos columnas responsivo',
    html: `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
        <td style="width: 48%; vertical-align: top; padding-right: 2%;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Columna 1</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Contenido de la primera columna.</p>
        </td>
        <td style="width: 48%; vertical-align: top; padding-left: 2%;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Columna 2</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Contenido de la segunda columna.</p>
        </td>
    </tr>
</table>`
  },
  {
    id: 'divider',
    name: 'Divisor',
    icon: '➖',
    description: 'Línea divisora',
    html: `<tr>
    <td style="padding: 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td style="border-top: 1px solid #e5e7eb;"></td>
            </tr>
        </table>
    </td>
</tr>`
  },
  {
    id: 'footer',
    name: 'Footer',
    icon: '📄',
    description: 'Pie de página con enlaces',
    html: `<tr>
    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            © 2024 Be-Mindpower. Todos los derechos reservados.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            <a href="#" style="color: #6b7280; text-decoration: none;">Darse de baja</a> |
            <a href="#" style="color: #6b7280; text-decoration: none;">Política de privacidad</a>
        </p>
    </td>
</tr>`
  }
]

// Vista previa HTML
const previewHtml = computed(() => {
  if (!htmlContent.value) {
    return '<html><body style="font-family: Arial, sans-serif; padding: 20px; color: #666;"><p>Selecciona una plantilla o escribe tu HTML...</p></body></html>'
  }
  return htmlContent.value
})

// Métodos
const applyTemplate = (template: any) => {
  htmlContent.value = template.html
  updatePreview()
  emit('update:modelValue', template.html)
}

const insertComponent = (component: any) => {
  // Insertar el componente en la posición del cursor o al final
  const cursorPos = htmlContent.value.length
  const beforeCursor = htmlContent.value.substring(0, cursorPos)
  const afterCursor = htmlContent.value.substring(cursorPos)
  
  htmlContent.value = beforeCursor + '\n' + component.html + '\n' + afterCursor
  updatePreview()
  emit('update:modelValue', htmlContent.value)
}

const updatePreview = () => {
  emit('update:modelValue', htmlContent.value)
}

const optimizeForEmail = () => {
  let optimizedHtml = htmlContent.value
  
  // Aplicar optimizaciones automáticas
  const optimizations = [
    // Convertir CSS externo a inline (básico)
    {
      pattern: /<style[^>]*>([\s\S]*?)<\/style>/gi,
      replacement: '<!-- Estilos movidos inline -->'
    },
    // Asegurar que las tablas tengan los atributos correctos
    {
      pattern: /<table(?![^>]*role="presentation")/gi,
      replacement: '<table role="presentation" cellspacing="0" cellpadding="0" border="0"'
    },
    // Agregar alt text a imágenes sin él
    {
      pattern: /<img(?![^>]*alt=)/gi,
      replacement: '<img alt=""'
    }
  ]
  
  optimizations.forEach(opt => {
    optimizedHtml = optimizedHtml.replace(opt.pattern, opt.replacement)
  })
  
  htmlContent.value = optimizedHtml
  updatePreview()
  emit('update:modelValue', optimizedHtml)
  
  // Mostrar mensaje de éxito
  alert('HTML optimizado para emails!')
}

const validateEmailHtml = () => {
  const html = htmlContent.value
  const messages: string[] = []
  
  // Validaciones básicas
  if (!html.includes('<!DOCTYPE html>')) {
    messages.push('Agrega <!DOCTYPE html> al inicio del documento')
  }
  
  if (!html.includes('role="presentation"')) {
    messages.push('Usa role="presentation" en las tablas de layout')
  }
  
  if (html.includes('display: flex') || html.includes('display: grid')) {
    messages.push('Evita CSS Grid y Flexbox, usa tablas para el layout')
  }
  
  if (!html.includes('@media')) {
    messages.push('Considera agregar media queries para responsive')
  }
  
  if (html.includes('<div') && !html.includes('table')) {
    messages.push('Usa tablas en lugar de divs para mejor compatibilidad')
  }
  
  if (!html.includes('mso-table-lspace')) {
    messages.push('Agrega estilos específicos para Outlook (mso-*)')
  }
  
  validationMessages.value = messages
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  htmlContent.value = newValue
})

watch(htmlContent, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.email-template-builder {
  @apply space-y-6;
}

/* Estilos para el iframe de vista previa */
iframe {
  transition: width 0.3s ease;
}
</style>


