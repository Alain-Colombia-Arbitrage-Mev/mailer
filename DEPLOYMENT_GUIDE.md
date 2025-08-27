# 🚀 Guía de Deployment - Mailer Be-Mindpower

## 🚨 Problema Identificado

Los logs muestran que **las variables de entorno no se están cargando correctamente** en el deployment:
```
!Failed to set up process.env.secrets
```

## ✅ Soluciones de Deployment

### 1. **Variables de Entorno Requeridas**

Configure estas variables en su plataforma de deployment (AWS Amplify/Vercel/Netlify):

```bash
# Supabase
SUPABASE_URL=https://hxmdzhkkuhsetqucbpia.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bWR6aGtrdWhzZXRxdWNicGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4Mzk5MjEsImV4cCI6MjA2NDQxNTkyMX0.-vUT8oRIKl4Pk7UZDOVhxxMRCictahFwAFEYc98HwFI
SUPABASE_SERVICE_ROLE_KEY=your_complete_service_role_key_here

# Admin
ADMIN_EMAIL=info@be-mindpower.net
ADMIN_PASSWORD=Be-mind.2025+++

# SMTP
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USERNAME=info@be-mindpower.net
SMTP_PASSWORD=@Angelyalaia.2024
SMTP_FROM_NAME=BMP Support
SMTP_FROM_EMAIL=info@be-mindpower.net
SMTP_REPLY_TO=info@be-mindpower.net

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Base
BASE_URL=https://your-production-domain.com
NODE_ENV=production
```

### 2. **Para AWS Amplify**

1. **Vaya a la consola de AWS Amplify**
2. **Seleccione su aplicación**
3. **Environment variables > Manage variables**
4. **Agregue cada variable una por una**

### 3. **Para Vercel**

```bash
# En terminal local
npx vercel env add SUPABASE_URL
npx vercel env add SUPABASE_ANON_KEY
# ... repita para todas las variables
```

### 4. **Para Netlify**

1. **Site settings > Environment variables**
2. **Add variable** para cada una

## 🔧 Comandos de Actualización Local

### Actualizar Node.js (Requerido)

```bash
# Con nvm
nvm install 20.19.0
nvm use 20.19.0

# Verificar versión
node --version  # Debe mostrar v20.19.0+
```

### Limpiar y Reinstalar Dependencias

```bash
# Limpiar cache
rm -rf node_modules package-lock.json .nuxt .output

# Reinstalar con Node.js correcto
npm install

# Ejecutar desarrollo
npm run dev
```

## 🔍 Verificación de Variables

### Test Local

Cree archivo `.env.local` para verificar:

```bash
# .env.local (NO subir a git)
SUPABASE_URL=https://hxmdzhkkuhsetqucbpia.supabase.co
SUPABASE_ANON_KEY=su_clave_anon_aqui
ADMIN_EMAIL=info@be-mindpower.net
ADMIN_PASSWORD=su_password_aqui
```

### Test de Conexión

```bash
npm run dev
# Visite http://localhost:3000/auth/login
# Intente login con credenciales admin
```

## ⚠️ Problemas Comunes

### 1. **Service Role Key Incompleta**
- La key en nuxt.config.ts está truncada
- Debe obtener la key completa desde Supabase Dashboard

### 2. **Variables No Se Cargan**
- Verificar que los nombres coincidan exactamente
- No usar espacios en los valores
- Reiniciar el deployment después de agregar variables

### 3. **Errores de Node.js**
- Usar Node.js 20.19.0 o superior
- Verificar .nvmrc en el repositorio
- Configurar Node version en plataforma de deployment

## 🚀 Proceso de Deployment Completo

1. **Configurar variables de entorno** en la plataforma
2. **Verificar Node.js version** (20.19.0+)
3. **Push código actualizado** con las mejoras
4. **Verificar build logs** que no aparezcan warnings de engine
5. **Probar autenticación** en production

## 📋 Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Node.js 20.19.0+ instalado
- [ ] Service role key completa
- [ ] Build sin errores de engine
- [ ] Login funciona en production
- [ ] Middlewares aplicados correctamente