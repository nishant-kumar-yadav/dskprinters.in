import nodemailer from 'nodemailer';

// You can configure this using environment variables in production
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAdminNotification = async (lead) => {
  try {
    const mailOptions = {
      from: '"DSK Printers" <noreply@dskprinters.in>',
      to: process.env.ADMIN_EMAIL || 'admin@dskprinters.in',
      subject: `New Quote Request from ${lead.name}`,
      text: `You have received a new quote request.\n\nName: ${lead.name}\nPhone: ${lead.phone}\nProduct: ${lead.product || 'N/A'}\nQuantity: ${lead.quantity || 'N/A'}\nMessage: ${lead.message || 'N/A'}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return false;
  }
};
