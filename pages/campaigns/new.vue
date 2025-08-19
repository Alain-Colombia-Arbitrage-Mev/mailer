<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Nueva Campaña</h1>
        <p class="mt-1 text-sm text-gray-500">
          Crea y configura una nueva campaña de email marketing
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/campaigns"
          class="btn btn-outline"
        >
          ← Volver a Campañas
        </NuxtLink>
      </div>
    </div>

    <!-- Campaign form -->
    <form @submit.prevent="saveCampaign" class="space-y-6">
      <!-- Basic information -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Información Básica</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Nombre de la Campaña *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input"
                placeholder="Ej: Newsletter Marzo 2024"
              />
            </div>
            <div>
              <label class="form-label">Plantilla</label>
              <select v-model="form.template_id" class="input">
                <option value="">Crear desde cero</option>
                <option
                  v-for="template in templates"
                  :key="template.id"
                  :value="template.id"
                >
                  {{ template.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="form-label">Asunto del Email *</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="input"
              placeholder="Ej: ¡Ofertas especiales solo para ti!"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Contenido del Email</h3>
        </div>
        <div class="card-body space-y-4">
          <div>
            <label class="form-label">Contenido HTML *</label>
            <textarea
              v-model="form.html_content"
              rows="10"
              required
              class="input"
              placeholder="Escribe el contenido HTML de tu email aquí..."
            ></textarea>
            <p class="form-help">
              Puedes usar variables como {{firstName}}, {{lastName}}, {{email}}, {{Balance}}
            </p>
          </div>

          <div>
            <label class="form-label">Contenido de Texto (Opcional)</label>
            <textarea
              v-model="form.text_content"
              rows="6"
              class="input"
              placeholder="Versión en texto plano del email..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Sender information -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Información del Remitente</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Nombre del Remitente *</label>
              <input
                v-model="form.from_name"
                type="text"
                required
                class="input"
                placeholder="Ej: Mailer Be-Mindpower"
              />
            </div>
            <div>
              <label class="form-label">Email del Remitente *</label>
              <input
                v-model="form.from_email"
                type="email"
                required
                class="input"
                placeholder="Ej: noreply@tudominio.com"
              />
            </div>
          </div>

          <div>
            <label class="form-label">Email de Respuesta</label>
            <input
              v-model="form.reply_to"
              type="email"
              class="input"
              placeholder="Ej: soporte@tudominio.com"
            />
          </div>
        </div>
      </div>

      <!-- Recipients -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Destinatarios</h3>
        </div>
        <div class="card-body space-y-4">
          <div>
            <label class="form-label">Seleccionar Destinatarios</label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="form.recipient_type"
                  type="radio"
                  value="all"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Todos los usuarios activos</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.recipient_type"
                  type="radio"
                  value="filtered"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Usuarios con filtros específicos</span>
              </label>
            </div>
          </div>

          <!-- Filters -->
          <div v-if="form.recipient_type === 'filtered'" class="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Balance Mínimo</label>
                <input
                  v-model.number="form.balance_min_filter"
                  type="number"
                  min="0"
                  step="0.01"
                  class="input"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label class="form-label">Balance Máximo</label>
                <input
                  v-model.number="form.balance_max_filter"
                  type="number"
                  min="0"
                  step="0.01"
                  class="input"
                  placeholder="1000.00"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Estado KYC</label>
                <select v-model="form.kyc_status_filter" class="input">
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
              <div>
                <label class="form-label">País</label>
                <input
                  v-model="form.country_filter"
                  type="text"
                  class="input"
                  placeholder="Ej: ES, MX, AR"
                />
              </div>
            </div>
          </div>

          <!-- Recipient count -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Destinatarios estimados:</strong> {{ estimatedRecipients }} usuarios
            </p>
          </div>
        </div>
      </div>

      <!-- Scheduling -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900">Programación</h3>
        </div>
        <div class="card-body space-y-4">
          <div>
            <label class="form-label">¿Cuándo enviar?</label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="form.send_type"
                  type="radio"
                  value="now"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Enviar ahora</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.send_type"
                  type="radio"
                  value="scheduled"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Programar envío</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.send_type"
                  type="radio"
                  value="draft"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Guardar como borrador</span>
              </label>
            </div>
          </div>

          <div v-if="form.send_type === 'scheduled'">
            <label class="form-label">Fecha y Hora de Envío</label>
            <input
              v-model="form.scheduled_at"
              type="datetime-local"
              class="input"
              :min="minDateTime"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="saveDraft"
          class="btn btn-outline"
          :disabled="saving"
        >
          Guardar Borrador
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="saving || !isFormValid"
        >
          <span v-if="saving" class="spinner mr-2"></span>
          {{ getSubmitButtonText() }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// State
const form = reactive({
  name: '',
  template_id: '',
  subject: '',
  html_content: '',
  text_content: '',
  from_name: 'Mailer Be-Mindpower',
  from_email: 'noreply@tudominio.com',
  reply_to: '',
  recipient_type: 'all',
  balance_min_filter: null,
  balance_max_filter: null,
  kyc_status_filter: '',
  country_filter: '',
  send_type: 'draft',
  scheduled_at: ''
})

const saving = ref(false)
const templates = ref([]) // Mock templates
const estimatedRecipients = ref(0)

// Computed
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30) // Minimum 30 minutes from now
  return now.toISOString().slice(0, 16)
})

const isFormValid = computed(() => {
  return form.name && 
         form.subject && 
         form.html_content && 
         form.from_name && 
         form.from_email &&
         (form.send_type !== 'scheduled' || form.scheduled_at)
})

// Methods
const saveDraft = async () => {
  form.send_type = 'draft'
  await saveCampaign()
}

const saveCampaign = async () => {
  if (!isFormValid.value) return

  saving.value = true
  try {
    const campaignData = {
      name: form.name,
      template_id: form.template_id || null,
      subject: form.subject,
      html_content: form.html_content,
      text_content: form.text_content,
      from_name: form.from_name,
      from_email: form.from_email,
      reply_to: form.reply_to || null,
      status: form.send_type === 'now' ? 'sending' : 
              form.send_type === 'scheduled' ? 'scheduled' : 'draft',
      scheduled_at: form.send_type === 'scheduled' ? form.scheduled_at : null,
      balance_min_filter: form.balance_min_filter,
      balance_max_filter: form.balance_max_filter,
      kyc_status_filter: form.kyc_status_filter || null,
      country_filter: form.country_filter || null,
      total_contacts: estimatedRecipients.value
    }

    // Here you would call the API to save the campaign
    console.log('Saving campaign:', campaignData)
    
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to campaigns list
    await navigateTo('/campaigns')
    
  } catch (error) {
    console.error('Error saving campaign:', error)
  } finally {
    saving.value = false
  }
}

const getSubmitButtonText = () => {
  if (saving.value) return 'Guardando...'
  
  switch (form.send_type) {
    case 'now':
      return 'Crear y Enviar'
    case 'scheduled':
      return 'Programar Campaña'
    default:
      return 'Guardar Borrador'
  }
}

// Load templates on mount
onMounted(async () => {
  // Mock loading templates
  templates.value = [
    { id: '1', name: 'Newsletter Básico' },
    { id: '2', name: 'Promoción Especial' },
    { id: '3', name: 'Bienvenida' }
  ]
  
  // Mock estimated recipients
  estimatedRecipients.value = 1234
})

// Watch for recipient filter changes
watch([
  () => form.recipient_type,
  () => form.balance_min_filter,
  () => form.balance_max_filter,
  () => form.kyc_status_filter,
  () => form.country_filter
], async () => {
  // Here you would call API to get estimated recipient count
  // For now, mock it
  if (form.recipient_type === 'all') {
    estimatedRecipients.value = 1234
  } else {
    estimatedRecipients.value = Math.floor(Math.random() * 500) + 100
  }
})
</script>
