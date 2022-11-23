require('dotenv').config();

const connect = require('./src/Database/MongoDB/connect');
const express = require('express');

const app = express();
const port = process.env['PORT'] || 3000;

connect();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./src/appConfigs/Routes/Controllers/authController')(app)

app.listen(port, () => console.log(`Listening on port ${port}`))