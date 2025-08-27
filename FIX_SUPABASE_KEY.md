# 🔧 Fix: Service Role Key de Supabase Incorrecta

## 🚨 Problema Detectado
```
Error de autenticación: Credenciales inválidas
```
**Causa:** La Service Role Key de Supabase está truncada/incorrecta

## ✅ Solución Paso a Paso

### **Paso 1: Obtener la Service Role Key Correcta**

1. **Ir a Supabase Dashboard**
   - Visita: https://supabase.com/dashboard
   - Inicia sesión con tu cuenta

2. **Seleccionar tu proyecto**
   - Busca el proyecto: `hxmdzhkkuhsetqucbpia`
   - Haz clic en él

3. **Ir a Settings → API**
   - En el sidebar izquierdo: `Settings`
   - Luego: `API`

4. **Copiar las keys correctas:**
   - **Project URL:** `https://hxmdzhkkuhsetqucbpia.supabase.co` ✅
   - **anon/public key:** (La que ya tienes parece correcta)
   - **service_role key:** ⚠️ **ESTA es la que necesitas copiar completa**

### **Paso 2: Actualizar Variables de Entorno**

**En tu archivo `.env`:**
```bash
# Supabase Configuration
SUPABASE_URL=https://hxmdzhkkuhsetqucbpia.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.AQUI_VA_LA_SERVICE_ROLE_KEY_COMPLETA_SIN_TRUNCAR

# Admin Credentials
ADMIN_EMAIL=info@be-mindpower.net
ADMIN_PASSWORD=Be-mind.2025+++
```

**⚠️ IMPORTANTE:** La Service Role Key debe ser completa, no truncada.

### **Paso 3: Verificar que las Keys son Correctas**

La **Service Role Key** debe:
- Empezar con: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- Tener 3 partes separadas por puntos
- Terminar sin `...` (no estar truncada)
- Ser mucho más larga que la actual

### **Paso 4: Reiniciar el Servidor**

```bash
# Detener servidor actual (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### **Paso 5: Probar el Login**

1. Ve a: http://localhost:3000/auth/login
2. Usa las credenciales:
   - **Email:** `info@be-mindpower.net`
   - **Password:** `Be-mind.2025+++`

## 🔍 Verificación Adicional

### **Si el problema persiste:**

1. **Verifica que el usuario existe en Supabase:**
   - Dashboard → Authentication → Users
   - ¿Está el usuario `info@be-mindpower.net` creado?

2. **Si NO existe, créalo:**
   - Authentication → Users → Invite user
   - Email: `info@be-mindpower.net`
   - Password: `Be-mind.2025+++`
   - Metadata: `{"role": "admin", "is_admin": true}`

3. **Verifica el RLS (Row Level Security):**
   - Database → Tables
   - ¿Están las políticas RLS configuradas correctamente?

## 🚀 Para Deployment (AWS Amplify)

Una vez que funcione en local:

1. **AWS Amplify Console**
2. **Environment variables**
3. **Agregar la Service Role Key correcta:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=la_key_completa_aqui
   ```

## 📞 Si Necesitas Ayuda

Si sigues teniendo problemas:

1. **Verifica los logs del servidor:** Busca más detalles del error
2. **Comprueba la consola del navegador:** F12 → Console
3. **Revisa que las credenciales admin sean exactas:** Email y password deben coincidir exactamente