# Mailer Be-Mindpower 📧

Sistema empresarial completo de email marketing con **Magic Link Authentication**, tracking avanzado y envío masivo, desarrollado con Nuxt 3, Supabase y Amazon SES.

## 🚀 Características Principales

### 🔐 Autenticación de Administrador Único
- **Acceso restringido**: Solo administradores autorizados
- **Credenciales configurables**: Variables de entorno personalizables
- **Registro deshabilitado**: Sin registro público disponible
- **Sesiones seguras**: Cookies httpOnly con expiración automática
- **Sesiones JWT**: Tokens seguros con renovación automática

### ✅ Gestión de Contactos
- Base completa con tags/categorías
- Importación CSV/Excel con validación
- Filtros avanzados y búsqueda
- Gestión de estados (activo, inactivo, rebotado, desuscrito)

### ✅ Sistema de Emails
- Envío individual y masivo
- Plantillas HTML personalizables
- Programación de envíos
- Editor visual de contenido
- Personalización con variables

### ✅ Adjuntos y Archivos
- Subida con Supabase Storage
- Validación de tipos y tamaños
- Gestión de archivos por campaña

### ✅ Tracking Avanzado
- Pixel tracking para aperturas
- Tracking de clics con redirección
- Geolocalización por IP
- Análisis de dispositivos y navegadores

### ✅ Sistema de Colas
- Procesamiento en background
- Rate limiting (14 emails/segundo para SES)
- Reintentos automáticos
- Manejo robusto de errores

### ✅ Analytics Completo
- Métricas en tiempo real
- Reportes de deliverabilidad
- KPIs por campaña
- Dashboard interactivo
- Exportación de datos

## 🛠️ Stack Tecnológico

- **Frontend/Backend**: Nuxt 3
- **Base de Datos**: Supabase (PostgreSQL)
- **Email Service**: Amazon SES
- **Storage**: Supabase Storage
- **UI**: Tailwind CSS + Headless UI
- **State Management**: Pinia
- **Validación**: Vee-Validate + Yup
- **Charts**: Chart.js + Vue-ChartJS

## 📋 Requisitos Previos

- Node.js 18+ 
- Cuenta de Supabase
- Cuenta de AWS con SES configurado
- Dominio verificado en SES (para producción)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd mailer-be-mindpower
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key

# Amazon SES
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
AWS_REGION=us-east-1

# Aplicación
BASE_URL=http://localhost:3000
DEFAULT_FROM_EMAIL=noreply@tudominio.com
```

4. **Configurar la base de datos**

Ejecuta el script SQL en tu panel de Supabase:
```bash
# El archivo database/schema.sql contiene todas las tablas necesarias
```

5. **Configurar Amazon SES**
- Verifica tu dominio en AWS SES
- Configura las credenciales IAM con permisos de SES
- Si estás en sandbox, verifica las direcciones de email de destino

6. **Configurar Magic Link en Supabase**
- Ve a Authentication > Settings en tu panel de Supabase
- Habilita "Enable email confirmations"
- Configura el "Site URL" como `http://localhost:3000` (desarrollo)
- Personaliza las plantillas de email si es necesario

7. **Ejecutar en desarrollo**
```bash
npm run dev
```

## 🔐 Guía de Magic Link Authentication

### Cómo Funciona

1. **Solicitud de Acceso**: El usuario ingresa su email en `/auth/login`
2. **Envío de Magic Link**: Supabase envía un enlace único al email
3. **Verificación**: El usuario hace clic en el enlace del email
4. **Callback**: La aplicación procesa la autenticación en `/auth/callback`
5. **Acceso Concedido**: Redirección automática al dashboard

### Ventajas del Magic Link

- ✅ **Sin contraseñas**: Elimina el riesgo de contraseñas débiles
- ✅ **Seguridad**: Enlaces temporales que expiran automáticamente
- ✅ **UX mejorada**: Proceso de login simplificado
- ✅ **Menos fricción**: No hay que recordar contraseñas
- ✅ **Auto-registro**: Crea usuarios nuevos automáticamente

### Configuración de Producción

Para producción, asegúrate de:

1. Configurar el dominio correcto en Supabase
2. Personalizar las plantillas de email
3. Configurar SPF/DKIM para mejor deliverabilidad
4. Habilitar rate limiting en Supabase

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **contacts**: Gestión de contactos con metadatos
- **tags**: Sistema de etiquetas para categorización
- **contact_tags**: Relación many-to-many entre contactos y tags
- **email_templates**: Plantillas HTML reutilizables
- **email_campaigns**: Campañas de email marketing
- **email_attachments**: Archivos adjuntos por campaña
- **email_sends**: Registro individual de cada envío
- **email_opens**: Tracking de aperturas con geolocalización
- **email_clicks**: Tracking de clics con URLs originales
- **email_queue**: Cola de procesamiento en background
- **system_settings**: Configuración del sistema

### Características de la BD

- **Índices optimizados** para consultas rápidas
- **Triggers automáticos** para timestamps
- **Row Level Security (RLS)** habilitado
- **Políticas de seguridad** configuradas
- **Funciones SQL** para operaciones complejas

## 📁 Estructura del Proyecto

```
mailer/
├── components/           # Componentes Vue reutilizables
│   ├── Contact/         # Gestión de contactos
│   ├── Email/           # Campañas y plantillas
│   ├── UI/              # Componentes de interfaz
│   └── Layout/          # Componentes de layout
├── pages/               # Páginas de la aplicación
│   ├── auth/            # Autenticación
│   ├── contacts/        # Gestión de contactos
│   ├── campaigns/       # Campañas de email
│   ├── templates/       # Plantillas HTML
│   └── analytics/       # Dashboard y reportes
├── server/api/          # API endpoints
│   ├── contacts/        # CRUD de contactos
│   ├── campaigns/       # Gestión de campañas
│   ├── tracking/        # Endpoints de tracking
│   └── analytics/       # Métricas y reportes
├── composables/         # Lógica reutilizable
│   ├── useSupabase.ts   # Cliente de Supabase
│   ├── useEmailTracking.ts # Tracking de emails
│   └── useFileUpload.ts # Subida de archivos
├── stores/              # Estado global (Pinia)
│   ├── contacts.ts      # Estado de contactos
│   ├── campaigns.ts     # Estado de campañas
│   └── analytics.ts     # Estado de analytics
├── utils/               # Utilidades
│   ├── supabase.ts      # Configuración de Supabase
│   └── aws-ses.ts       # Servicio de Amazon SES
└── database/            # Scripts de base de datos
    └── schema.sql       # Esquema completo
```

## 🚀 Características de Producción

### Seguridad
- **Rate limiting** en APIs críticas
- **Validación robusta** de datos
- **Sanitización** de contenido HTML
- **Protección CSRF** integrada
- **Headers de seguridad** configurados

### Compliance
- **GDPR compliant** con gestión de consentimientos
- **CAN-SPAM Act** compliance
- **Unsubscribe automático** en todos los emails
- **Logging estructurado** para auditorías

### Performance
- **Caching inteligente** de consultas
- **Optimización de imágenes** automática
- **Lazy loading** de componentes
- **Compresión gzip** habilitada
- **CDN ready** para assets estáticos

### Monitoreo
- **Health checks** automáticos
- **Métricas de performance** integradas
- **Error tracking** con stack traces
- **Alertas automáticas** por email

## 📊 Métricas y Analytics

### KPIs Principales
- **Tasa de entrega**: % de emails entregados exitosamente
- **Tasa de apertura**: % de emails abiertos (únicos)
- **Tasa de clics**: % de emails con al menos un clic
- **Tasa de rebote**: % de emails que rebotaron
- **Tasa de desuscripción**: % de contactos que se desuscribieron

### Reportes Disponibles
- **Dashboard en tiempo real** con métricas actualizadas
- **Análisis geográfico** de aperturas y clics
- **Análisis temporal** con gráficos interactivos
- **Top performers** de campañas y enlaces
- **Exportación** en CSV y Excel

## 🔄 Flujo de Envío de Emails

1. **Creación de campaña** con contenido y destinatarios
2. **Validación** de datos y contenido
3. **Adición a cola** de procesamiento
4. **Procesamiento en background** con rate limiting
5. **Envío via Amazon SES** con tracking integrado
6. **Actualización de métricas** en tiempo real
7. **Manejo de rebotes** y desuscripciones automático

## 🛡️ Configuración de Seguridad

### Amazon SES
```bash
# Configurar políticas IAM mínimas
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

### Supabase RLS
```sql
-- Ejemplo de política RLS
CREATE POLICY "Users can only access their own data" ON contacts
  FOR ALL USING (auth.uid() = user_id);
```

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo
npm run build              # Build para producción
npm run preview            # Preview del build

# Base de datos
npm run db:reset           # Resetear esquema
npm run db:seed            # Poblar con datos de prueba

# Testing
npm run test               # Ejecutar tests
npm run test:coverage      # Coverage report

# Linting
npm run lint               # Verificar código
npm run lint:fix           # Corregir automáticamente
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@be-mindpower.com
- 📖 Documentación: [docs.be-mindpower.com](https://docs.be-mindpower.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/mailer-be-mindpower/issues)

## 🔐 Configuración de Autenticación

### Variables de Entorno para Login

El sistema utiliza **acceso administrativo único** con credenciales configurables:

```bash
# Credenciales de administrador
username_mailer=info@be-mindpower.net
password_mailer=Be-mind.2025+++

# Supabase Service Role Key (opcional, para creación automática de usuarios)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### Credenciales por Defecto

Si no configuras las variables de entorno, el sistema usará:
- **Email:** `info@be-mindpower.net`
- **Contraseña:** `Be-mind.2025+++`

### Acceso al Sistema

1. Navega a `/auth/admin-login`
2. Ingresa las credenciales configuradas
3. **Primera vez:** El sistema registrará automáticamente el usuario en Supabase
4. Sesión administrativa válida por 8 horas

### Obtener Service Role Key (Opcional)

Para creación automática de usuarios, necesitas el Service Role Key de Supabase:

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Settings** → **API**
3. Copia el **service_role key** (¡NO el anon key!)
4. Agrégalo como variable de entorno: `SUPABASE_SERVICE_ROLE_KEY=tu_key_aqui`

> ⚠️ **Importante:** El Service Role Key tiene permisos completos. Manténlo seguro y nunca lo expongas en el frontend.

### Características de Seguridad

- ✅ **Registro público deshabilitado**
- ✅ **Acceso único de administrador**
- ✅ **Sesiones con expiración automática**
- ✅ **Middleware de protección en todas las rutas**
- ✅ **Cookies seguras con httpOnly**

## 🎯 Roadmap

### Próximas Características
- [ ] **A/B Testing** para campañas
- [ ] **Automatizaciones** basadas en triggers
- [ ] **Integración con CRM** (Salesforce, HubSpot)
- [ ] **API REST completa** para integraciones
- [ ] **Webhooks** para eventos en tiempo real
- [ ] **Templates marketplace** con diseños predefinidos
- [ ] **Multi-tenant** para agencias
- [ ] **White-label** customizable

---

**Desarrollado con ❤️ por Be-Mindpower Team**