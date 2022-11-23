require('dotenv').config()
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport(
  {
    host: "pop3.mailtrap.io",
    port: 9950,
    secure: false,
    auth: {
      user: (process.env['MAIL_USER']).toString(),
      pass: (process.env['MAIL_PSSWRD']).toString()
    },
    tls: {
      rejectUnauthorized: false,
    }
  }
);

async function SendToken(token, email) {
  try {
    const mailSend = await transport.sendMail({
      text: `${token}`,
      subject: 'Nothing',
      from: 'Matheus <matheusborgesfig@gmail.com',
      to: `${email}`
    }, err => console.log(err))
  } catch {
    throw Error;
  }
}

module.exports = SendToken;