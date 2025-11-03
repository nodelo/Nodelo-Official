const nodemailer = require('nodemailer');

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send contact form notification email
 * @param {Object} contactData - Contact form submission data
 * @returns {Promise} - Email send result
 */
const sendContactNotification = async (contactData) => {
  const { name, email, company, projectType, budget, message } = contactData;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_FROM, // Send to your email
    replyTo: email, // Allow replying directly to the contact
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #667eea; }
          .message-box { background: white; padding: 15px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #764ba2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            ${company ? `
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${company}</div>
            </div>
            ` : ''}
            
            ${projectType ? `
            <div class="field">
              <div class="label">Project Type:</div>
              <div class="value">${projectType}</div>
            </div>
            ` : ''}
            
            ${budget ? `
            <div class="field">
              <div class="label">Budget Range:</div>
              <div class="value">${budget}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Submission from ${name}

Name: ${name}
Email: ${email}
${company ? `Company: ${company}\n` : ''}${projectType ? `Project Type: ${projectType}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}
Message:
${message}
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    throw error;
  }
};

/**
 * Send auto-reply confirmation email to the contact
 * @param {Object} contactData - Contact form submission data
 * @returns {Promise} - Email send result
 */
const sendContactConfirmation = async (contactData) => {
  const { name, email } = contactData;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'We received your message - Nodelo',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thank you for contacting Nodelo!</h2>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within 2 business days.</p>
            <p>We appreciate your interest in working with us!</p>
            <p>Best regards,<br>The Nodelo Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

We've received your message and will get back to you within 2 business days.

We appreciate your interest in working with us!

Best regards,
The Nodelo Team
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    // Don't throw - this is optional, shouldn't fail the submission
    return { success: false, error: error.message };
  }
};

/**
 * Send admin reply email to user
 * @param {Object} replyData - Reply data
 * @returns {Promise} - Email send result
 */
const sendAdminReplyEmail = async (replyData) => {
  const { to, userName, adminName, message, originalMessage } = replyData;

  const mailOptions = {
    from: `"${adminName} (Nodelo)" <${process.env.EMAIL_FROM}>`,
    to: to,
    replyTo: process.env.EMAIL_FROM,
    subject: `Re: Your inquiry - ${adminName} from Nodelo`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .reply-box { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #667eea; }
          .original-box { background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #ccc; }
          .signature { margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Response from Nodelo</h2>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for reaching out to us. Here's a response from ${adminName}:</p>
            
            <div class="reply-box">
              <strong>Reply from ${adminName}:</strong><br><br>
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            ${originalMessage ? `
            <p><strong>Your original message:</strong></p>
            <div class="original-box">
              ${originalMessage.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            
            <div class="signature">
              <p>Best regards,<br>${adminName}<br>Nodelo Team</p>
              <p style="font-size: 12px; color: #666;">You can continue this conversation by replying to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${userName},

Thank you for reaching out to us. Here's a response from ${adminName}:

${message}

${originalMessage ? `\nYour original message:\n${originalMessage}\n` : ''}

Best regards,
${adminName}
Nodelo Team

You can continue this conversation by replying to this email.
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin reply email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin reply email:', error);
    throw error;
  }
};

/**
 * Verify email transporter configuration
 * @returns {Promise} - Verification result
 */
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendContactNotification,
  sendContactConfirmation,
  sendAdminReplyEmail,
  verifyEmailConfig,
};

