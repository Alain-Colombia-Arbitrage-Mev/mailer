#!/usr/bin/env node

/**
 * Script para resetear la contraseña del administrador en Supabase
 * Usage: node scripts/reset-admin-password.js [nueva-password]
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Función para generar password segura
function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-='
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Función para leer variables de entorno del .env
function loadEnvVars() {
  try {
    const envPath = join(process.cwd(), '.env')
    const envContent = readFileSync(envPath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ Error leyendo .env:', error.message)
    return {}
  }
}

async function resetAdminPassword() {
  console.log('🔧 RESET ADMIN PASSWORD - Iniciando...\n')
  
  // Cargar variables de entorno
  const envVars = loadEnvVars()
  
  const SUPABASE_URL = envVars.SUPABASE_URL || 'https://hxmdzhkkuhsetqucbpia.supabase.co'
  const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY
  const ADMIN_EMAIL = envVars.ADMIN_EMAIL || 'info@be-mindpower.net'
  
  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY no encontrada en .env')
    process.exit(1)
  }
  
  console.log('📋 CONFIG:')
  console.log('📍 Supabase URL:', SUPABASE_URL)
  console.log('📧 Admin Email:', ADMIN_EMAIL)
  console.log('🔑 Service Key:', SUPABASE_SERVICE_KEY.substring(0, 20) + '...\n')
  
  // Crear cliente admin de Supabase
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  // Generar nueva password (o usar la proporcionada)
  const newPassword = process.argv[2] || generateSecurePassword(16)
  
  console.log('🔐 NUEVA PASSWORD GENERADA:', newPassword)
  console.log('📏 Longitud:', newPassword.length)
  console.log('')
  
  try {
    // Buscar el usuario por email
    console.log('🔍 Buscando usuario admin...')
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      throw new Error(`Error listando usuarios: ${listError.message}`)
    }
    
    let adminUser = users.users.find(user => user.email === ADMIN_EMAIL)
    
    if (!adminUser) {
      console.log('👤 Usuario no existe, creando...')
      
      // Crear el usuario si no existe
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: newPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Administrador',
          role: 'admin',
          is_admin: true
        }
      })
      
      if (createError) {
        throw new Error(`Error creando usuario: ${createError.message}`)
      }
      
      adminUser = createData.user
      console.log('✅ Usuario creado exitosamente')
      
    } else {
      console.log('👤 Usuario encontrado, actualizando password...')
      
      // Actualizar la password del usuario existente
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        {
          password: newPassword,
          user_metadata: {
            name: 'Administrador', 
            role: 'admin',
            is_admin: true
          }
        }
      )
      
      if (updateError) {
        throw new Error(`Error actualizando password: ${updateError.message}`)
      }
      
      console.log('✅ Password actualizada exitosamente')
    }
    
    console.log('\n🎉 ÉXITO!')
    console.log('=' .repeat(50))
    console.log('📧 EMAIL:', ADMIN_EMAIL)
    console.log('🔐 PASSWORD:', newPassword)
    console.log('=' .repeat(50))
    console.log('')
    console.log('🚀 PRÓXIMOS PASOS:')
    console.log('1. Actualiza tu .env con la nueva password:')
    console.log(`   ADMIN_PASSWORD=${newPassword}`)
    console.log('')
    console.log('2. Reinicia el servidor: npm run dev')
    console.log('')
    console.log('3. Prueba el login en: http://localhost:3001/auth/login')
    console.log('')
    
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    process.exit(1)
  }
}

// Ejecutar el script
resetAdminPassword().catch(console.error)