-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.USERS (
  idPerson bigint NOT NULL DEFAULT nextval('users_idperson_seq'::regclass),
  firstName text,
  lastName text,
  Gender text,
  birthday text,
  email text,
  idCountryPhone text,
  CountryPhone text,
  CodeNumber text,
  phoneNumber text,
  idCountryBirthday text,
  CountryBirthday text,
  username text,
  Balance numeric,
  auth_user_id uuid UNIQUE,
  kyc_status text,
  kyc_level text,
  CONSTRAINT USERS_pkey PRIMARY KEY (idPerson)
);
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  template_id uuid,
  status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'scheduled'::character varying, 'sending'::character varying, 'sent'::character varying, 'paused'::character varying, 'cancelled'::character varying]::text[])),
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  total_contacts integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  complained_count integer DEFAULT 0,
  tags_filter ARRAY DEFAULT '{}'::text[],
  balance_min_filter numeric,
  balance_max_filter numeric,
  kyc_status_filter character varying,
  country_filter character varying,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT campaigns_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.email_templates(id)
);
CREATE TABLE public.click_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email_log_id uuid,
  url text NOT NULL,
  clicked_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT click_logs_pkey PRIMARY KEY (id),
  CONSTRAINT click_logs_email_log_id_fkey FOREIGN KEY (email_log_id) REFERENCES public.email_logs(id)
);
CREATE TABLE public.contact_list_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contact_id uuid,
  list_id uuid,
  added_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_list_members_pkey PRIMARY KEY (id),
  CONSTRAINT contact_list_members_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.contact_lists(id),
  CONSTRAINT contact_list_members_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.mailing_contacts(id)
);
CREATE TABLE public.contact_lists (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  contact_count integer DEFAULT 0,
  tags ARRAY DEFAULT '{}'::text[],
  is_dynamic boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_lists_pkey PRIMARY KEY (id)
);
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  campaign_id uuid,
  contact_id uuid,
  email character varying NOT NULL,
  status character varying DEFAULT 'sent'::character varying CHECK (status::text = ANY (ARRAY['sent'::character varying, 'delivered'::character varying, 'opened'::character varying, 'clicked'::character varying, 'bounced'::character varying, 'complained'::character varying]::text[])),
  message_id character varying,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  bounce_reason text,
  complaint_reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_logs_pkey PRIMARY KEY (id),
  CONSTRAINT email_logs_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.mailing_contacts(id),
  CONSTRAINT email_logs_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id)
);
CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  subject character varying NOT NULL,
  html_content text NOT NULL,
  text_content text,
  thumbnail_url character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT email_templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.mailing_contacts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  phone character varying,
  company character varying,
  tags ARRAY DEFAULT '{}'::text[],
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'bounced'::character varying, 'complained'::character varying, 'unsubscribed'::character varying]::text[])),
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT true,
  balance numeric DEFAULT 0,
  kyc_status character varying DEFAULT 'pending'::character varying,
  kyc_level character varying DEFAULT 'basic'::character varying,
  country character varying,
  gender character varying,
  birthday character varying,
  external_user_id bigint,
  metadata jsonb DEFAULT '{}'::jsonb,
  subscribed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mailing_contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  transaction_id text,
  crypto_amount text,
  crypto_currency text,
  fiat_amount text,
  fiat_currency text,
  status text,
  destination_wallet text,
  paid_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_payments_user_email FOREIGN KEY (user_email) REFERENCES public.userslogin(email)
);
CREATE TABLE public.real_estate_filters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  category character varying NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT real_estate_filters_pkey PRIMARY KEY (id)
);
CREATE TABLE public.real_estate_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  image_url text NOT NULL,
  image_path text NOT NULL,
  is_main boolean DEFAULT false,
  display_order integer DEFAULT 0,
  alt_text character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT real_estate_images_pkey PRIMARY KEY (id),
  CONSTRAINT fk_images_property_id FOREIGN KEY (property_id) REFERENCES public.real_estate_properties(id)
);
CREATE TABLE public.real_estate_properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  description text,
  property_type character varying NOT NULL CHECK (property_type::text = ANY (ARRAY['casa'::character varying, 'edificio'::character varying, 'apartamento'::character varying, 'oficina'::character varying, 'comercial'::character varying, 'vivienda'::character varying]::text[])),
  address text NOT NULL,
  city character varying NOT NULL,
  country character varying NOT NULL,
  total_price numeric NOT NULL,
  price_per_fraction numeric NOT NULL,
  total_fractions integer NOT NULL DEFAULT 100,
  available_fractions integer NOT NULL,
  sold_fractions integer NOT NULL DEFAULT 0,
  area_sqm numeric CHECK (area_sqm IS NULL OR area_sqm > 0::numeric),
  bedrooms integer,
  bathrooms integer,
  parking_spaces integer,
  year_built integer,
  status character varying NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'sold_out'::character varying, 'inactive'::character varying, 'draft'::character varying]::text[])),
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  publisher_id uuid NOT NULL,
  publisher_email character varying NOT NULL,
  CONSTRAINT real_estate_properties_pkey PRIMARY KEY (id)
);
CREATE TABLE public.real_estate_property_filters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  filter_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT real_estate_property_filters_pkey PRIMARY KEY (id),
  CONSTRAINT real_estate_property_filters_filter_id_fkey FOREIGN KEY (filter_id) REFERENCES public.real_estate_filters(id),
  CONSTRAINT real_estate_property_filters_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.real_estate_properties(id)
);
CREATE TABLE public.real_estate_purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  buyer_id uuid NOT NULL,
  buyer_email character varying NOT NULL,
  fractions_purchased integer NOT NULL CHECK (fractions_purchased > 0),
  price_per_fraction numeric NOT NULL,
  total_amount numeric NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'refunded'::character varying]::text[])),
  payment_method character varying DEFAULT 'balance'::character varying,
  purchased_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  CONSTRAINT real_estate_purchases_pkey PRIMARY KEY (id),
  CONSTRAINT fk_purchases_property_id FOREIGN KEY (property_id) REFERENCES public.real_estate_properties(id)
);
CREATE TABLE public.sms_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  contact_id uuid,
  phone character varying NOT NULL,
  message text NOT NULL,
  status character varying DEFAULT 'sent'::character varying CHECK (status::text = ANY (ARRAY['sent'::character varying, 'delivered'::character varying, 'failed'::character varying]::text[])),
  message_id character varying,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sms_logs_pkey PRIMARY KEY (id),
  CONSTRAINT sms_logs_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.mailing_contacts(id)
);
CREATE TABLE public.user_wallets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  wallet_address character varying NOT NULL CHECK (wallet_address::text ~ '^0x[a-fA-F0-9]{40}$'::text),
  currency character varying NOT NULL DEFAULT 'USDT'::character varying CHECK (currency::text = ANY (ARRAY['USDT'::character varying, 'BUSD'::character varying, 'BNB'::character varying, 'ETH'::character varying, 'BTC'::character varying]::text[])),
  network character varying NOT NULL DEFAULT 'BEP20'::character varying CHECK (network::text = ANY (ARRAY['BEP20'::character varying, 'ERC20'::character varying, 'TRC20'::character varying, 'BTC'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_wallets_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_wallets_auth_user_id FOREIGN KEY (user_id) REFERENCES public.userslogin(auth_user_id)
);
CREATE TABLE public.userslogin (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL UNIQUE,
  user_id bigint NOT NULL,
  email text NOT NULL UNIQUE,
  login_email text,
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  wallet text,
  CONSTRAINT userslogin_pkey PRIMARY KEY (id),
  CONSTRAINT fk_userslogin_user_id FOREIGN KEY (user_id) REFERENCES public.USERS(idPerson)
);
CREATE TABLE public.wallet_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_email text NOT NULL UNIQUE,
  wallet_address text NOT NULL,
  assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  last_used_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT wallet_assignments_pkey PRIMARY KEY (id)
);