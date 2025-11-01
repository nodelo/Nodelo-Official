import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const { name, email, company, projectType, budget, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 })
    }

    // TODO: Implement email sending logic
    // Options:
    // 1. Resend (recommended for Vercel)
    //    - npm install resend
    //    - import { Resend } from 'resend'
    //    - const resend = new Resend(process.env.RESEND_API_KEY)
    //    - await resend.emails.send({ ... })
    //
    // 2. SendGrid
    //    - npm install @sendgrid/mail
    //    - import sgMail from '@sendgrid/mail'
    //    - sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    //    - await sgMail.send({ ... })
    //
    // 3. Nodemailer (for custom SMTP)
    //    - npm install nodemailer
    //    - import nodemailer from 'nodemailer'
    //    - const transporter = nodemailer.createTransport({ ... })
    //    - await transporter.sendMail({ ... })
    //
    // 4. Webhook to external service (Zapier, Make, etc.)
    //    - await fetch(process.env.WEBHOOK_URL, { method: 'POST', body: JSON.stringify(body) })

    // Example payload structure:
    // {
    //   from: 'noreply@nodelo.com',
    //   to: 'hello@nodelo.com',
    //   subject: `New contact form submission from ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
    //     ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
    //     ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // }

    console.log("Contact form submission:", { name, email, company, projectType, budget, message })

    return NextResponse.json({
      success: true,
      message: "Message received successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
