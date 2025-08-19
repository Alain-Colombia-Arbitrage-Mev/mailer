import { serverSupabaseClient } from '#supabase/server'
import type { MailingContact } from './supabase-schema'

// Tipo Contact simplificado basado en MailingContact
export interface Contact {
  id?: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  company?: string | null
  status: 'active' | 'inactive' | 'bounced' | 'complained' | 'unsubscribed'
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface DatabaseResponse<T> {
  data?: T
  error?: any
}

export class DatabaseService {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  async createContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<Contact>> {
    try {
      // Preparar datos para insertar en mailing_contacts
      const insertData = {
        email: contactData.email,
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        phone: contactData.phone,
        company: contactData.company,
        status: contactData.status || 'active',
        tags: [], // Array vacío por defecto
        email_notifications: true, // Por defecto habilitado
        sms_notifications: false, // Por defecto deshabilitado
        balance: 0, // Balance inicial
        kyc_status: 'pending', // Estado KYC por defecto
        kyc_level: 'basic', // Nivel KYC por defecto
        metadata: contactData.metadata || {},
        subscribed_at: new Date().toISOString()
      }

      const { data, error } = await this.supabase
        .from('mailing_contacts')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        return { error }
      }

      // Convertir de MailingContact a Contact
      const contact: Contact = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        company: data.company,
        status: data.status,
        metadata: data.metadata,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { data: contact }
    } catch (error) {
      return { error }
    }
  }

  async updateContact(id: number, updates: Partial<Contact>): Promise<DatabaseResponse<Contact>> {
    try {
      // Preparar datos para actualizar
      const updateData: any = {}
      
      if (updates.email !== undefined) updateData.email = updates.email
      if (updates.first_name !== undefined) updateData.first_name = updates.first_name
      if (updates.last_name !== undefined) updateData.last_name = updates.last_name
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.company !== undefined) updateData.company = updates.company
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.metadata !== undefined) updateData.metadata = updates.metadata

      // Agregar timestamp de actualización
      updateData.updated_at = new Date().toISOString()

      const { data, error } = await this.supabase
        .from('mailing_contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { error }
      }

      if (!data) {
        return { error: { message: 'Contacto no encontrado' } }
      }

      // Convertir de MailingContact a Contact
      const contact: Contact = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        company: data.company,
        status: data.status,
        metadata: data.metadata,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { data: contact }
    } catch (error) {
      return { error }
    }
  }

  async deleteContact(id: number): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from('mailing_contacts')
        .delete()
        .eq('id', id)

      if (error) {
        return { error }
      }

      return { data: true }
    } catch (error) {
      return { error }
    }
  }

  async getContact(id: number): Promise<DatabaseResponse<Contact>> {
    try {
      const { data, error } = await this.supabase
        .from('mailing_contacts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { error }
      }

      if (!data) {
        return { error: { message: 'Contacto no encontrado' } }
      }

      // Convertir de MailingContact a Contact
      const contact: Contact = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        company: data.company,
        status: data.status,
        metadata: data.metadata,
        created_at: data.created_at,
        updated_at: data.updated_at
      }

      return { data: contact }
    } catch (error) {
      return { error }
    }
  }

  async getContacts(limit = 50, offset = 0): Promise<DatabaseResponse<Contact[]>> {
    try {
      const { data, error } = await this.supabase
        .from('mailing_contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return { error }
      }

      // Convertir de MailingContact[] a Contact[]
      const contacts: Contact[] = data.map((item: any) => ({
        id: item.id,
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        phone: item.phone,
        company: item.company,
        status: item.status,
        metadata: item.metadata,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))

      return { data: contacts }
    } catch (error) {
      return { error }
    }
  }
}

// Función principal que será importada por los archivos de API
export const useDatabase = () => {
  const event = useEvent()
  const supabase = serverSupabaseClient(event)
  
  return new DatabaseService(supabase)
}

// Exportar el tipo Contact para uso en otros archivos
export type { Contact }
