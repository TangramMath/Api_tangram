const express = require('express');
const {google} = require('googleapis');
const fs = require('fs').promises;
const process = require('process');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const router = express.Router()
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function TakeData(cde, auth){
    const sheet = google.sheets({version:'v4', auth:auth})
    const resp = await sheet.spreadsheets.values.get({
        spreadsheetId: '1d8bgdc2fYE_PKGeOa_DXiHUSxjJwpoq2SVMbzx6dN98',
        range: `${cde}!E2:H`
    })
    const data = resp.data.values;
    return data;
}

router.get('/:cde', (req, res) => {
  authorize().then(auth => TakeData(req.params.cde, auth).then(data => {

      let notTreated = data;
      let init = notTreated.shift();
      let TreatedData = [];
      TreatedData.push(notTreated.shift());
      TreatedData.splice(2,1);
      notTreated.forEach(element => {
        if (TreatedData[TreatedData.length - 1][0] === element[0]){
          let day = TreatedData[TreatedData.length - 1].shift()
          TreatedData[TreatedData.length - 1].unshift(day ,element[1])
        } else{
          treatElement = element;
          treatElement.splice(2,1);
          TreatedData.push(treatElement);
        }
      })
      let FinalData = [];

      TreatedData.forEach( element => {
        arr = [element.shift()];
        element.forEach(value =>{
          if(typeof(value) !== null){
            arr.push(parseInt(value))
          }
        })
        FinalData.unshift(arr);
      })

      FinalData.unshift(init);
      res.send(FinalData);

  } )).catch(console.err)
})

module.exports = app => app.use('/cde', router);