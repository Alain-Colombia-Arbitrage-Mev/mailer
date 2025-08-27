/**
 * Script para agregar contactos de ejemplo a la tabla mailing_contacts
 * Ejecutar con: node scripts/add-sample-contacts.js
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase (desde variables de entorno)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Usamos service role para inserción

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Contactos de ejemplo
const sampleContacts = [
  {
    email: 'juan.perez@example.com',
    first_name: 'Juan',
    last_name: 'Pérez',
    phone: '+1234567890',
    company: 'Tech Solutions',
    tags: ['cliente', 'vip'],
    status: 'active',
    email_notifications: true,
    sms_notifications: true,
    balance: 1500.00,
    kyc_status: 'verified',
    kyc_level: 'premium',
    country: 'México',
    gender: 'male',
    metadata: {
      source: 'website',
      preferences: {
        newsletter: true,
        promotions: false
      }
    }
  },
  {
    email: 'maria.garcia@example.com',
    first_name: 'María',
    last_name: 'García',
    phone: '+9876543210',
    company: 'Creative Agency',
    tags: ['prospecto', 'marketing'],
    status: 'active',
    email_notifications: true,
    sms_notifications: false,
    balance: 750.00,
    kyc_status: 'pending',
    kyc_level: 'basic',
    country: 'España',
    gender: 'female',
    metadata: {
      source: 'referral',
      referrer: 'juan.perez@example.com'
    }
  },
  {
    email: 'carlos.rodriguez@example.com',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    phone: '+5556667777',
    company: 'StartupXYZ',
    tags: ['cliente', 'startup'],
    status: 'active',
    email_notifications: true,
    sms_notifications: true,
    balance: 2300.50,
    kyc_status: 'verified',
    kyc_level: 'business',
    country: 'Colombia',
    gender: 'male',
    birthday: '1985-03-15',
    metadata: {
      source: 'linkedin',
      industry: 'technology'
    }
  },
  {
    email: 'ana.lopez@example.com',
    first_name: 'Ana',
    last_name: 'López',
    phone: '+3339990000',
    company: 'Design Studio',
    tags: ['cliente', 'diseño'],
    status: 'active',
    email_notifications: true,
    sms_notifications: true,
    balance: 890.25,
    kyc_status: 'verified',
    kyc_level: 'premium',
    country: 'Argentina',
    gender: 'female',
    birthday: '1990-07-22',
    metadata: {
      source: 'social_media',
      platform: 'instagram'
    }
  },
  {
    email: 'test@bemindpower.com',
    first_name: 'Usuario',
    last_name: 'Prueba',
    phone: '+1111111111',
    company: 'Be Mindpower',
    tags: ['admin', 'test'],
    status: 'active',
    email_notifications: true,
    sms_notifications: true,
    balance: 5000.00,
    kyc_status: 'verified',
    kyc_level: 'admin',
    country: 'Internacional',
    gender: 'other',
    metadata: {
      source: 'system',
      role: 'admin'
    }
  }
]

async function addSampleContacts() {
  console.log('🚀 Iniciando inserción de contactos de ejemplo...')
  
  try {
    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('mailing_contacts')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error de conexión:', testError)
      return
    }

    console.log('✅ Conexión a Supabase establecida')

    // Insertar contactos uno por uno para manejar errores individuales
    for (const contact of sampleContacts) {
      try {
        console.log(`📝 Insertando contacto: ${contact.email}`)
        
        const { data, error } = await supabase
          .from('mailing_contacts')
          .insert(contact)
          .select()
        
        if (error) {
          if (error.code === '23505') { // Violación de unique constraint
            console.log(`⚠️  Contacto ${contact.email} ya existe, saltando...`)
          } else {
            console.error(`❌ Error insertando ${contact.email}:`, error.message)
          }
        } else {
          console.log(`✅ Contacto ${contact.email} insertado exitosamente`)
        }
      } catch (err) {
        console.error(`💥 Error inesperado con ${contact.email}:`, err)
      }
    }

    // Verificar el total de contactos
    const { count, error: countError } = await supabase
      .from('mailing_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (countError) {
      console.error('❌ Error obteniendo conteo:', countError)
    } else {
      console.log(`\n📊 Total de contactos activos: ${count}`)
    }

    console.log('\n🎉 ¡Proceso completado!')
    
  } catch (error) {
    console.error('💥 Error general:', error)
  }
}

// Ejecutar el script
addSampleContacts()

