import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'createdAt'],
    description: 'Contact form submissions from the website.',
  },
  access: {
    // Website API can create; only authenticated admins can read/update/delete
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const to = process.env.CONTACT_NOTIFY_EMAIL
        const smtpHost = process.env.SMTP_HOST
        const smtpUser = process.env.SMTP_USER
        const smtpPass = process.env.SMTP_PASS

        if (!to || !smtpHost || !smtpUser || !smtpPass) {
          console.warn('[ContactSubmissions] Email env vars not configured — skipping notification.')
          return
        }

        try {
          const nodemailer = await import('nodemailer')
          const transporter = nodemailer.default.createTransport({
            host: smtpHost,
            port: Number(process.env.SMTP_PORT ?? 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: smtpUser, pass: smtpPass },
          })

          await transporter.sendMail({
            from: `"LME Website" <${smtpUser}>`,
            to,
            subject: `New contact form submission from ${doc.name}`,
            text: [
              `Name: ${doc.name}`,
              `Phone: ${doc.phone}`,
              `Email: ${doc.email}`,
              `Message:\n${doc.message ?? '(none)'}`,
            ].join('\n'),
            html: `
              <p><strong>Name:</strong> ${doc.name}</p>
              <p><strong>Phone:</strong> <a href="tel:${doc.phone}">${doc.phone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${doc.email}">${doc.email}</a></p>
              <p><strong>Message:</strong></p>
              <p style="white-space:pre-wrap">${doc.message ?? '(none)'}</p>
            `,
          })
        } catch (err) {
          console.error('[ContactSubmissions] Failed to send email notification:', err)
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea' },
  ],
  timestamps: true,
}
