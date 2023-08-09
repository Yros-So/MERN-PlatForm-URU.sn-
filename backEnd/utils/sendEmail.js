const nodemailer = require('nodemailer');

const sendMail = async options => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6eb784795365d8",
          pass: "f4337506d6eb39"
        }
      });

      const message = {
        from: process.env.SMTP_FROM_NAME+' <'+process.env.SMTP_FROM_EMAIL+'>',
        to: options.email,
        subject: options.subject,
        text: options.message
      }

      await transporter.sendMail(message);
}

module.exports = sendMail;