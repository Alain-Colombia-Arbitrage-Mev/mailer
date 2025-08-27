-- Insertar contactos de ejemplo en la tabla mailing_contacts
-- Ejecutar este SQL en tu Dashboard de Supabase -> SQL Editor

INSERT INTO public.mailing_contacts (
    email, 
    first_name, 
    last_name, 
    phone, 
    company, 
    tags, 
    status, 
    email_notifications, 
    sms_notifications, 
    balance, 
    kyc_status, 
    kyc_level, 
    country, 
    gender, 
    metadata
) VALUES 
(
    'juan.perez@example.com',
    'Juan',
    'Pérez',
    '+1234567890',
    'Tech Solutions',
    ARRAY['cliente', 'vip'],
    'active',
    true,
    true,
    1500.00,
    'verified',
    'premium',
    'México',
    'male',
    '{"source": "website", "preferences": {"newsletter": true, "promotions": false}}'::jsonb
),
(
    'maria.garcia@example.com',
    'María',
    'García',
    '+9876543210',
    'Creative Agency',
    ARRAY['prospecto', 'marketing'],
    'active',
    true,
    false,
    750.00,
    'pending',
    'basic',
    'España',
    'female',
    '{"source": "referral", "referrer": "juan.perez@example.com"}'::jsonb
),
(
    'carlos.rodriguez@example.com',
    'Carlos',
    'Rodríguez',
    '+5556667777',
    'StartupXYZ',
    ARRAY['cliente', 'startup'],
    'active',
    true,
    true,
    2300.50,
    'verified',
    'business',
    'Colombia',
    'male',
    '{"source": "linkedin", "industry": "technology"}'::jsonb
),
(
    'ana.lopez@example.com',
    'Ana',
    'López',
    '+3339990000',
    'Design Studio',
    ARRAY['cliente', 'diseño'],
    'active',
    true,
    true,
    890.25,
    'verified',
    'premium',
    'Argentina',
    'female',
    '{"source": "social_media", "platform": "instagram"}'::jsonb
),
(
    'test@bemindpower.com',
    'Usuario',
    'Prueba',
    '+1111111111',
    'Be Mindpower',
    ARRAY['admin', 'test'],
    'active',
    true,
    true,
    5000.00,
    'verified',
    'admin',
    'Internacional',
    'other',
    '{"source": "system", "role": "admin"}'::jsonb
)
ON CONFLICT (email) DO NOTHING;  -- No insertar si el email ya existe

-- Verificar que se insertaron correctamente
SELECT 
    email, 
    first_name, 
    last_name, 
    company, 
    status,
    balance,
    created_at
FROM public.mailing_contacts 
WHERE email IN (
    'juan.perez@example.com',
    'maria.garcia@example.com', 
    'carlos.rodriguez@example.com',
    'ana.lopez@example.com',
    'test@bemindpower.com'
)
ORDER BY created_at DESC;

