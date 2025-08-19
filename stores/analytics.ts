import { defineStore } from 'pinia'

export interface AnalyticsMetrics {
  totalCampaigns: number
  totalContacts: number
  totalEmailsSent: number
  totalEmailsOpened: number
  totalEmailsClicked: number
  averageOpenRate: number
  averageClickRate: number
  bounceRate: number
  unsubscribeRate: number
}

export interface CampaignPerformance {
  id: string
  name: string
  sent: number
  opened: number
  clicked: number
  bounced: number
  openRate: number
  clickRate: number
  sentAt: string
}

export interface TimeSeriesData {
  date: string
  sent: number
  opened: number
  clicked: number
  bounced: number
}

export interface TopPerformers {
  campaigns: CampaignPerformance[]
  urls: Array<{ url: string; clicks: number }>
  locations: Array<{ location: string; opens: number }>
}

export interface AnalyticsState {
  metrics: AnalyticsMetrics
  timeSeriesData: TimeSeriesData[]
  topPerformers: TopPerformers
  campaignPerformance: CampaignPerformance[]
  dateRange: {
    start: string
    end: string
  }
  loading: boolean
  error: string | null
}

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => ({
    metrics: {
      totalCampaigns: 0,
      totalContacts: 0,
      totalEmailsSent: 0,
      totalEmailsOpened: 0,
      totalEmailsClicked: 0,
      averageOpenRate: 0,
      averageClickRate: 0,
      bounceRate: 0,
      unsubscribeRate: 0
    },
    timeSeriesData: [],
    topPerformers: {
      campaigns: [],
      urls: [],
      locations: []
    },
    campaignPerformance: [],
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días atrás
      end: new Date().toISOString().split('T')[0] // Hoy
    },
    loading: false,
    error: null
  }),

  getters: {
    totalEngagement: (state) => {
      return state.metrics.totalEmailsOpened + state.metrics.totalEmailsClicked
    },

    engagementRate: (state) => {
      if (state.metrics.totalEmailsSent === 0) return 0
      return ((state.metrics.totalEmailsOpened + state.metrics.totalEmailsClicked) / state.metrics.totalEmailsSent) * 100
    },

    deliveryRate: (state) => {
      if (state.metrics.totalEmailsSent === 0) return 0
      const delivered = state.metrics.totalEmailsSent - (state.metrics.totalEmailsSent * state.metrics.bounceRate / 100)
      return (delivered / state.metrics.totalEmailsSent) * 100
    },

    topCampaignsByOpenRate: (state) => {
      return [...state.campaignPerformance]
        .sort((a, b) => b.openRate - a.openRate)
        .slice(0, 5)
    },

    topCampaignsByClickRate: (state) => {
      return [...state.campaignPerformance]
        .sort((a, b) => b.clickRate - a.clickRate)
        .slice(0, 5)
    },

    recentTrend: (state) => {
      if (state.timeSeriesData.length < 2) return 'stable'
      
      const recent = state.timeSeriesData.slice(-7) // Últimos 7 días
      const older = state.timeSeriesData.slice(-14, -7) // 7 días anteriores
      
      const recentAvg = recent.reduce((sum, day) => sum + day.opened, 0) / recent.length
      const olderAvg = older.reduce((sum, day) => sum + day.opened, 0) / older.length
      
      if (recentAvg > olderAvg * 1.1) return 'up'
      if (recentAvg < olderAvg * 0.9) return 'down'
      return 'stable'
    }
  },

  actions: {
    async fetchOverviewMetrics() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/analytics/overview', {
          query: {
            start: this.dateRange.start,
            end: this.dateRange.end
          }
        })

        this.metrics = response.metrics
      } catch (error: any) {
        this.error = error.message || 'Error al cargar métricas generales'
      } finally {
        this.loading = false
      }
    },

    async fetchTimeSeriesData() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/analytics/timeseries', {
          query: {
            start: this.dateRange.start,
            end: this.dateRange.end
          }
        })

        this.timeSeriesData = response.data
      } catch (error: any) {
        this.error = error.message || 'Error al cargar datos de serie temporal'
      } finally {
        this.loading = false
      }
    },

    async fetchCampaignPerformance() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/analytics/campaigns', {
          query: {
            start: this.dateRange.start,
            end: this.dateRange.end
          }
        })

        this.campaignPerformance = response.campaigns
      } catch (error: any) {
        this.error = error.message || 'Error al cargar rendimiento de campañas'
      } finally {
        this.loading = false
      }
    },

    async fetchTopPerformers() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/analytics/top-performers', {
          query: {
            start: this.dateRange.start,
            end: this.dateRange.end
          }
        })

        this.topPerformers = response
      } catch (error: any) {
        this.error = error.message || 'Error al cargar top performers'
      } finally {
        this.loading = false
      }
    },

    async fetchAllAnalytics() {
      await Promise.all([
        this.fetchOverviewMetrics(),
        this.fetchTimeSeriesData(),
        this.fetchCampaignPerformance(),
        this.fetchTopPerformers()
      ])
    },

    async fetchCampaignAnalytics(campaignId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch(`/api/analytics/campaigns/${campaignId}`)
        return response
      } catch (error: any) {
        this.error = error.message || 'Error al cargar analytics de campaña'
        return null
      } finally {
        this.loading = false
      }
    },

    async exportAnalytics(format: 'csv' | 'pdf' = 'csv') {
      try {
        const response = await $fetch('/api/analytics/export', {
          method: 'POST',
          body: {
            format,
            dateRange: this.dateRange,
            metrics: this.metrics,
            campaigns: this.campaignPerformance
          }
        })

        return response
      } catch (error: any) {
        this.error = error.message || 'Error al exportar analytics'
        return null
      }
    },

    setDateRange(start: string, end: string) {
      this.dateRange = { start, end }
    },

    setDateRangePreset(preset: 'today' | 'week' | 'month' | 'quarter' | 'year') {
      const now = new Date()
      const end = now.toISOString().split('T')[0]
      let start: string

      switch (preset) {
        case 'today':
          start = end
          break
        case 'week':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        case 'month':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        case 'quarter':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        case 'year':
          start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          break
        default:
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      this.setDateRange(start, end)
    },

    // Métricas en tiempo real
    async startRealTimeUpdates() {
      // Actualizar cada 30 segundos
      const interval = setInterval(async () => {
        await this.fetchOverviewMetrics()
      }, 30000)

      // Guardar referencia para poder limpiar después
      return interval
    },

    // Comparación de períodos
    async compareWithPreviousPeriod() {
      const currentStart = new Date(this.dateRange.start)
      const currentEnd = new Date(this.dateRange.end)
      const periodLength = currentEnd.getTime() - currentStart.getTime()
      
      const previousStart = new Date(currentStart.getTime() - periodLength)
      const previousEnd = new Date(currentStart.getTime() - 1)

      try {
        const [currentData, previousData] = await Promise.all([
          $fetch('/api/analytics/overview', {
            query: {
              start: this.dateRange.start,
              end: this.dateRange.end
            }
          }),
          $fetch('/api/analytics/overview', {
            query: {
              start: previousStart.toISOString().split('T')[0],
              end: previousEnd.toISOString().split('T')[0]
            }
          })
        ])

        return {
          current: currentData.metrics,
          previous: previousData.metrics,
          changes: {
            totalEmailsSent: this.calculatePercentageChange(
              previousData.metrics.totalEmailsSent,
              currentData.metrics.totalEmailsSent
            ),
            averageOpenRate: this.calculatePercentageChange(
              previousData.metrics.averageOpenRate,
              currentData.metrics.averageOpenRate
            ),
            averageClickRate: this.calculatePercentageChange(
              previousData.metrics.averageClickRate,
              currentData.metrics.averageClickRate
            )
          }
        }
      } catch (error: any) {
        this.error = error.message || 'Error al comparar períodos'
        return null
      }
    },

    calculatePercentageChange(oldValue: number, newValue: number): number {
      if (oldValue === 0) return newValue > 0 ? 100 : 0
      return ((newValue - oldValue) / oldValue) * 100
    },

    // Predicciones basadas en tendencias
    predictNextPeriod() {
      if (this.timeSeriesData.length < 7) return null

      const recentData = this.timeSeriesData.slice(-7)
      const totalSent = recentData.reduce((sum, day) => sum + day.sent, 0)
      const totalOpened = recentData.reduce((sum, day) => sum + day.opened, 0)
      const totalClicked = recentData.reduce((sum, day) => sum + day.clicked, 0)

      const avgSent = totalSent / 7
      const avgOpened = totalOpened / 7
      const avgClicked = totalClicked / 7

      // Predicción simple basada en promedio de los últimos 7 días
      return {
        predictedSent: Math.round(avgSent * 7),
        predictedOpened: Math.round(avgOpened * 7),
        predictedClicked: Math.round(avgClicked * 7),
        predictedOpenRate: totalSent > 0 ? (avgOpened / avgSent) * 100 : 0,
        predictedClickRate: totalSent > 0 ? (avgClicked / avgSent) * 100 : 0
      }
    },

    // Alertas y notificaciones
    checkPerformanceAlerts() {
      const alerts = []

      // Alerta por baja tasa de apertura
      if (this.metrics.averageOpenRate < 15) {
        alerts.push({
          type: 'warning',
          message: 'Tasa de apertura por debajo del promedio (15%)',
          suggestion: 'Considera mejorar los asuntos de tus emails'
        })
      }

      // Alerta por alta tasa de rebote
      if (this.metrics.bounceRate > 5) {
        alerts.push({
          type: 'error',
          message: 'Alta tasa de rebote detectada',
          suggestion: 'Revisa y limpia tu lista de contactos'
        })
      }

      // Alerta por baja tasa de clics
      if (this.metrics.averageClickRate < 2) {
        alerts.push({
          type: 'info',
          message: 'Tasa de clics por debajo del promedio (2%)',
          suggestion: 'Mejora el contenido y llamadas a la acción'
        })
      }

      return alerts
    }
  }
})
