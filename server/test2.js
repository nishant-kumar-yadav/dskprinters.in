import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  auth: {
    user: 'sales@dskprinters.in',
    pass: 'DSK@sales2026'
  },
  debug: true,
  logger: true
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('Authentication Error:');
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
  process.exit(0);
});
