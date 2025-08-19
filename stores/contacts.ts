import { defineStore } from 'pinia'
import type { User as Contact } from '~/utils/supabase-schema'

// Tag interface local
interface Tag {
  id: string
  name: string
  color: string
  description?: string
  created_at: string
}

export interface ContactsState {
  contacts: Contact[]
  tags: Tag[]
  selectedContacts: string[]
  filters: {
    search: string
    tags: string[]
    status: string[]
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
  loading: boolean
  error: string | null
}

export const useContactsStore = defineStore('contacts', {
  state: (): ContactsState => ({
    contacts: [],
    tags: [],
    selectedContacts: [],
    filters: {
      search: '',
      tags: [],
      status: []
    },
    pagination: {
      page: 1,
      limit: 50,
      total: 0
    },
    loading: false,
    error: null
  }),

  getters: {
    filteredContacts: (state) => {
      let filtered = [...state.contacts]

      // Filtrar por búsqueda
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(contact => 
          contact.email.toLowerCase().includes(search) ||
          contact.first_name?.toLowerCase().includes(search) ||
          contact.last_name?.toLowerCase().includes(search) ||
          contact.company?.toLowerCase().includes(search)
        )
      }

      // Filtrar por estado
      if (state.filters.status.length > 0) {
        filtered = filtered.filter(contact => 
          state.filters.status.includes(contact.status)
        )
      }

      return filtered
    },

    selectedContactsData: (state) => {
      return state.contacts.filter(contact => 
        state.selectedContacts.includes(contact.id)
      )
    },

    contactsByStatus: (state) => {
      const statusCounts = {
        active: 0,
        inactive: 0,
        bounced: 0,
        unsubscribed: 0
      }

      state.contacts.forEach(contact => {
        statusCounts[contact.status]++
      })

      return statusCounts
    },

    totalPages: (state) => {
      return Math.ceil(state.pagination.total / state.pagination.limit)
    }
  },

  actions: {
    async fetchContacts(page?: number) {
      if (page) {
        this.pagination.page = page
      }

      this.loading = true
      this.error = null

      try {
        const { contacts, fetchContacts } = useContacts()
        
        await fetchContacts(
          this.pagination.page,
          this.pagination.limit,
          this.filters.search,
          this.filters.tags
        )

        this.contacts = contacts.value
        // Actualizar total desde el composable si está disponible
      } catch (error: any) {
        this.error = error.message || 'Error al cargar contactos'
      } finally {
        this.loading = false
      }
    },

    async createContact(contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const { createContact } = useContacts()
        const newContact = await createContact(contactData)

        if (newContact) {
          this.contacts.unshift(newContact)
          this.pagination.total++
        }

        return newContact
      } catch (error: any) {
        this.error = error.message || 'Error al crear contacto'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateContact(id: string, updates: Partial<Contact>) {
      this.loading = true
      this.error = null

      try {
        const { updateContact } = useContacts()
        const updatedContact = await updateContact(id, updates)

        if (updatedContact) {
          const index = this.contacts.findIndex(c => c.id === id)
          if (index !== -1) {
            this.contacts[index] = updatedContact
          }
        }

        return updatedContact
      } catch (error: any) {
        this.error = error.message || 'Error al actualizar contacto'
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteContact(id: string) {
      this.loading = true
      this.error = null

      try {
        const { deleteContact } = useContacts()
        const success = await deleteContact(id)

        if (success) {
          this.contacts = this.contacts.filter(c => c.id !== id)
          this.selectedContacts = this.selectedContacts.filter(cId => cId !== id)
          this.pagination.total--
        }

        return success
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar contacto'
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteSelectedContacts() {
      if (this.selectedContacts.length === 0) return

      this.loading = true
      this.error = null

      try {
        const results = []
        
        for (const contactId of this.selectedContacts) {
          const success = await this.deleteContact(contactId)
          results.push({ id: contactId, success })
        }

        this.selectedContacts = []
        return results
      } catch (error: any) {
        this.error = error.message || 'Error al eliminar contactos'
        return []
      } finally {
        this.loading = false
      }
    },

    async importContacts(contactsData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>[]) {
      this.loading = true
      this.error = null

      try {
        const { importContacts } = useContacts()
        const results = await importContacts(contactsData)

        // Recargar la lista después de la importación
        await this.fetchContacts()

        return results
      } catch (error: any) {
        this.error = error.message || 'Error al importar contactos'
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchTags() {
      try {
        const { tags, fetchTags } = useTags()
        await fetchTags()
        this.tags = tags.value
      } catch (error: any) {
        console.error('Error fetching tags:', error)
      }
    },

    async createTag(tagData: Omit<Tag, 'id' | 'created_at'>) {
      try {
        const { createTag } = useTags()
        const newTag = await createTag(tagData)

        if (newTag) {
          this.tags.push(newTag)
        }

        return newTag
      } catch (error: any) {
        this.error = error.message || 'Error al crear tag'
        return null
      }
    },

    // Gestión de selección
    selectContact(contactId: string) {
      if (!this.selectedContacts.includes(contactId)) {
        this.selectedContacts.push(contactId)
      }
    },

    deselectContact(contactId: string) {
      this.selectedContacts = this.selectedContacts.filter(id => id !== contactId)
    },

    toggleContactSelection(contactId: string) {
      if (this.selectedContacts.includes(contactId)) {
        this.deselectContact(contactId)
      } else {
        this.selectContact(contactId)
      }
    },

    selectAllContacts() {
      this.selectedContacts = this.filteredContacts.map(contact => contact.id)
    },

    deselectAllContacts() {
      this.selectedContacts = []
    },

    toggleAllContactsSelection() {
      if (this.selectedContacts.length === this.filteredContacts.length) {
        this.deselectAllContacts()
      } else {
        this.selectAllContacts()
      }
    },

    // Gestión de filtros
    setSearchFilter(search: string) {
      this.filters.search = search
      this.pagination.page = 1
    },

    setTagsFilter(tags: string[]) {
      this.filters.tags = tags
      this.pagination.page = 1
    },

    setStatusFilter(status: string[]) {
      this.filters.status = status
      this.pagination.page = 1
    },

    clearFilters() {
      this.filters = {
        search: '',
        tags: [],
        status: []
      }
      this.pagination.page = 1
    },

    // Paginación
    setPage(page: number) {
      this.pagination.page = page
    },

    setLimit(limit: number) {
      this.pagination.limit = limit
      this.pagination.page = 1
    },

    nextPage() {
      if (this.pagination.page < this.totalPages) {
        this.pagination.page++
      }
    },

    prevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--
      }
    }
  }
})
