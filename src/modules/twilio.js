require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


async function SendToken(token, number) {
  try {
    await client.messages
      .create({
         body: `${token}`,
         from: process.env.NUMBER,
         to: `+55${number}`
       })
      .then(message => console.log(message.sid));    
  } catch {
    throw Error;
  }
}

module.exports = SendToken;