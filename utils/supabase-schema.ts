// Tipos basados en el esquema real de Supabase

export interface User {
  idPerson: number
  firstName?: string
  lastName?: string
  Gender?: string
  birthday?: string
  email?: string
  idCountryPhone?: string
  CountryPhone?: string
  CodeNumber?: string
  phoneNumber?: string
  idCountryBirthday?: string
  CountryBirthday?: string
  username?: string
  Balance?: number
  auth_user_id?: string
  kyc_status?: string
  kyc_level?: string
}

export interface UserLogin {
  id: string
  auth_user_id: string
  user_id: number
  email: string
  login_email?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
  wallet?: string
}

export interface MailingContact {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  company?: string
  tags: string[]
  status: 'active' | 'inactive' | 'bounced' | 'complained' | 'unsubscribed'
  email_notifications: boolean
  sms_notifications: boolean
  balance: number
  kyc_status: string
  kyc_level: string
  country?: string
  gender?: string
  birthday?: string
  external_user_id?: number
  metadata: Record<string, any>
  subscribed_at: string
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  text_content?: string
  thumbnail_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  name: string
  template_id?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  scheduled_at?: string
  sent_at?: string
  total_contacts: number
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  bounced_count: number
  complained_count: number
  tags_filter: string[]
  balance_min_filter?: number
  balance_max_filter?: number
  kyc_status_filter?: string
  country_filter?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: string
  campaign_id?: string
  contact_id?: string
  email: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  message_id?: string
  opened_at?: string
  clicked_at?: string
  bounce_reason?: string
  complaint_reason?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ClickLog {
  id: string
  email_log_id?: string
  url: string
  clicked_at: string
  ip_address?: string
  user_agent?: string
  metadata: Record<string, any>
  created_at: string
}

export interface ContactList {
  id: string
  name: string
  description?: string
  contact_count: number
  tags: string[]
  is_dynamic: boolean
  created_at: string
  updated_at: string
}

export interface ContactListMember {
  id: string
  contact_id?: string
  list_id?: string
  added_at: string
}

export interface SmsLog {
  id: string
  contact_id?: string
  phone: string
  message: string
  status: 'sent' | 'delivered' | 'failed'
  message_id?: string
  error_message?: string
  metadata: Record<string, any>
  created_at: string
}

export interface Payment {
  id: string
  user_email: string
  transaction_id?: string
  crypto_amount?: string
  crypto_currency?: string
  fiat_amount?: string
  fiat_currency?: string
  status?: string
  destination_wallet?: string
  paid_at: string
}

export interface UserWallet {
  id: string
  user_id: string
  wallet_address: string
  currency: 'USDT' | 'BUSD' | 'BNB' | 'ETH' | 'BTC'
  network: 'BEP20' | 'ERC20' | 'TRC20' | 'BTC'
  created_at: string
  updated_at: string
}

export interface WalletAssignment {
  id: string
  user_email: string
  wallet_address: string
  assigned_at: string
  last_used_at: string
  usage_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Funciones helper para trabajar con las tablas
export const supabaseHelpers = {
  // Obtener plantillas de email
  async getEmailTemplates(supabase: any, limit = 10) {
    return await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .limit(limit)
  },

  // Obtener contactos de mailing
  async getMailingContacts(supabase: any, limit = 50) {
    return await supabase
      .from('mailing_contacts')
      .select('*')
      .eq('status', 'active')
      .limit(limit)
  },

  // Obtener campañas
  async getCampaigns(supabase: any, limit = 20) {
    return await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Crear contacto de mailing
  async createMailingContact(supabase: any, contact: Partial<MailingContact>) {
    return await supabase
      .from('mailing_contacts')
      .insert([contact])
      .select()
  },

  // Crear campaña
  async createCampaign(supabase: any, campaign: Partial<Campaign>) {
    return await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
  },

  // Obtener logs de email
  async getEmailLogs(supabase: any, campaignId?: string, limit = 100) {
    let query = supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    return await query
  },

  // Crear log de email
  async createEmailLog(supabase: any, log: Partial<EmailLog>) {
    return await supabase
      .from('email_logs')
      .insert([log])
      .select()
  },

  // Obtener estadísticas de campaña
  async getCampaignStats(supabase: any, campaignId: string) {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    const { data: logs } = await supabase
      .from('email_logs')
      .select('status')
      .eq('campaign_id', campaignId)

    return {
      campaign,
      logs,
      stats: {
        total: logs?.length || 0,
        sent: logs?.filter(l => l.status === 'sent').length || 0,
        delivered: logs?.filter(l => l.status === 'delivered').length || 0,
        opened: logs?.filter(l => l.status === 'opened').length || 0,
        clicked: logs?.filter(l => l.status === 'clicked').length || 0,
        bounced: logs?.filter(l => l.status === 'bounced').length || 0,
        complained: logs?.filter(l => l.status === 'complained').length || 0
      }
    }
  }
}

