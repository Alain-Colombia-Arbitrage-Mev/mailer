import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

export class AmazonSESService {
  private ses: SESClient

  constructor() {
    // Usar variables de entorno directamente
    this.ses = new SESClient({
      region: process.env.SES_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || ''
      }
    })
  }

  /**
   * Envía un email individual
   */
  async sendEmail(params: {
    to: string | string[]
    from: string
    subject: string
    html?: string
    text?: string
    replyTo?: string
  }) {
    try {
      const toAddresses = Array.isArray(params.to) ? params.to : [params.to]
      
      const command = new SendEmailCommand({
        Source: params.from,
        Destination: {
          ToAddresses: toAddresses
        },
        Message: {
          Subject: {
            Data: params.subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: params.html ? {
              Data: params.html,
              Charset: 'UTF-8'
            } : undefined,
            Text: params.text ? {
              Data: params.text,
              Charset: 'UTF-8'
            } : undefined
          }
        },
        ReplyToAddresses: params.replyTo ? [params.replyTo] : undefined
      })

      const result = await this.ses.send(command)
      
      return {
        success: true,
        messageId: result.MessageId,
        data: result
      }
    } catch (error: any) {
      console.error('Error enviando email con SES:', error)
      return {
        success: false,
        error: error.message,
        code: error.code
      }
    }
  }

  /**
   * Envía emails en lote
   */
  async sendBulkEmails(emails: Array<{
    to: string
    from: string
    subject: string
    html?: string
    text?: string
    replyTo?: string
  }>) {
    const results: Array<{
      email: string
      success: boolean
      messageId?: string
      data?: any
      error?: string
      code?: string
    }> = []
    
    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push({
        email: email.to,
        ...result
      })
      
      // Pequeña pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return results
  }
}

// Instancia singleton
export const sesService = new AmazonSESService()

// Función helper para obtener el servicio SES
export const getSESService = () => sesService
