require('dotenv').config()
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport(
  {
    host: "smtp.mailtrap.io",
    port: 2525,
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
      from: 'Matheus <tangram.mb@gmail.com',
      to: `${email}`
    }, err => console.log(err))
  } catch {
    throw Error;
  }
}

module.exports = SendToken;