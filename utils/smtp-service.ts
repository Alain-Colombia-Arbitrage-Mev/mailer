import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

export class SMTPService {
  private transporter: Transporter | null = null

  private getTransporter() {
    if (!this.transporter) {
      console.log('🔧 Creando transporter SMTP...')
      // Configuración SMTP específica para AWS SES
      this.transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false, // false para puerto 587 con STARTTLS
        requireTLS: true, // Requerir TLS para AWS SES
        auth: {
          user: 'AKIAXTORPJBRNRZLIA5D',
          pass: 'BNaIDr1v7NBLZOFWJKYy8Qv2Wm7QFMLUWTyBcJzrB8kk'
        },
        tls: {
          // Configuración específica para AWS SES
          rejectUnauthorized: true,
          ciphers: 'SSLv3'
        },
        connectionTimeout: 10000, // 10 segundos
        greetingTimeout: 5000, // 5 segundos
        socketTimeout: 10000 // 10 segundos
      })
      console.log('✅ Transporter SMTP creado exitosamente')
    }
    return this.transporter
  }

  /**
   * Verifica la conexión SMTP
   */
  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🔍 Iniciando verificación de conexión SMTP...')
      console.log('🔍 Configuración SMTP:', {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        user: 'AKIAXTORPJBRNRZLIA5D',
        secure: false
      })
      
      const transporter = this.getTransporter()
      console.log('🔍 Transporter obtenido, verificando...')
      
      await transporter.verify()
      console.log('✅ Conexión SMTP verificada correctamente')
      return true
    } catch (error: any) {
      console.error('❌ Error verificando conexión SMTP:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname
      })
      return false
    }
  }

  /**
   * Prueba de conexión alternativa enviando un email real
   */
  async testConnectionWithEmail(testEmail: string): Promise<{ success: boolean, error?: string, messageId?: string }> {
    try {
      console.log('🧪 Probando conexión enviando email real a:', testEmail)
      
      const result = await this.sendEmail({
        to: testEmail,
        subject: 'Test de Conexión SMTP - BMP',
        html: '<h1>✅ Conexión SMTP Exitosa</h1><p>Si recibes este email, la configuración SMTP está funcionando correctamente.</p>',
        text: '✅ Conexión SMTP Exitosa\n\nSi recibes este email, la configuración SMTP está funcionando correctamente.'
      })
      
      return result
    } catch (error: any) {
      console.error('❌ Error en prueba de conexión con email:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Envía un email individual
   */
  async sendEmail(params: {
    to: string | string[]
    from?: string
    subject: string
    html?: string
    text?: string
    replyTo?: string
    attachments?: Array<{
      filename: string
      content: Buffer | string
      contentType?: string
    }>
  }) {
    try {
      console.log('📤 Iniciando envío SMTP con parámetros:', {
        to: params.to,
        from: params.from,
        subject: params.subject,
        hasHtml: !!params.html,
        hasText: !!params.text,
        attachments: params.attachments?.length || 0
      })

      const fromEmail = params.from || 'info@be-mindpower.net'
      const fromName = 'BMP Support'
      const replyTo = params.replyTo || 'info@be-mindpower.net'

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
        replyTo: replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
        attachments: params.attachments
      }

      console.log('📧 Opciones de correo configuradas:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html,
        hasText: !!mailOptions.text,
        attachmentsCount: mailOptions.attachments?.length || 0,
        attachmentsInfo: mailOptions.attachments?.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.content?.length || 0
        })) || []
      })

      const transporter = this.getTransporter()
      console.log('🚀 Enviando email...')
      const result = await transporter.sendMail(mailOptions)
      console.log('✅ Email enviado exitosamente:', result.messageId)
      
      return {
        success: true,
        messageId: result.messageId,
        data: result
      }
    } catch (error: any) {
      console.error('❌ Error enviando email con SMTP:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        stack: error.stack
      })
      return {
        success: false,
        error: error.message,
        code: error.code,
        response: error.response
      }
    }
  }

  /**
   * Envía emails en lote
   */
  async sendBulkEmails(emails: Array<{
    to: string
    from?: string
    subject: string
    html?: string
    text?: string
    replyTo?: string
    attachments?: Array<{
      filename: string
      content: Buffer | string
      contentType?: string
    }>
  }>) {
    const results = []
    
    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push({
        email: email.to,
        ...result
      })
      
      // Pequeña pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    return results
  }

  /**
   * Procesa plantillas con variables dinámicas
   */
  processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template
    
    // Reemplazar variables del tipo {{variable}}
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      processed = processed.replace(regex, variables[key] || '')
    })
    
    return processed
  }

  /**
   * Envía email con plantilla
   */
  async sendTemplateEmail(params: {
    to: string | string[]
    template: {
      subject: string
      html_content: string
      text_content?: string
    }
    variables?: Record<string, any>
    from?: string
    replyTo?: string
    attachments?: Array<{
      filename: string
      content: Buffer | string
      contentType?: string
    }>
  }) {
    const variables = params.variables || {}
    
    const processedSubject = this.processTemplate(params.template.subject, variables)
    const processedHtml = this.processTemplate(params.template.html_content, variables)
    const processedText = params.template.text_content 
      ? this.processTemplate(params.template.text_content, variables)
      : undefined

    return this.sendEmail({
      to: params.to,
      from: params.from,
      subject: processedSubject,
      html: processedHtml,
      text: processedText,
      replyTo: params.replyTo,
      attachments: params.attachments
    })
  }
}

// Instancia singleton
export const smtpService = new SMTPService()

// Función helper para obtener el servicio
export const getEmailService = () => smtpService
