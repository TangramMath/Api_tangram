const useUser = require('../../../Database/use_cases/crudUser');
const express = require('express');
const sendToken = require('../../../modules/nodeMailer');

const router = express.Router();

router.post('/signup/', async (req, res) => {
    try {
        const token = await useUser.create(req.body);
        res.status(200).send(token)
    } catch {
        res.status(401).send({ msg: "There is already this cde" })
    }
})

router.get('/login/token', async (req, res) => {
    try {
        const userData = await useUser.read_token(req.headers.authorization);
        res.status(200).send(userData)
    } catch {
        res.status(401).send({ msg: 'There is no token' })
    }
})

router.get('/login/notToken/:login/:psswrd', async (req, res) => {
    const token = await useUser.read_login(req.params.login, req.params.psswrd);
    if (token === '') {
        res.status(401).send({ msg: 'Invalid login' })
    } else {
        const userData = await useUser.read_token(token);
        res.status(200).send({ user: userData, token: token })
    }
})

router.post('/reset/psswrd', async (req, res) => {
    try {
        const body = req.body
        const response = await useUser.setResetPassword(body.cde);
        const token = response.token
        await sendToken(token, response.email)
        res.status(200).send({ msg: 'everything is okay' })
    } catch {
        res.status(404).send({ msg: 'unable to do it' })
    }
})

router.patch('/update/:newPsswrd/:token', async (req, res) => {
    const user = req.body
    if (await useUser.checkChangePsswrd(user.cde, req.params.token)) {
        await useUser.changePassword(user.cde, req.params.newPsswrd);
        res.status(200).send({msg:'Changed! Try to log in again!'})
    } else {
        res.status(401).send({msg:'Unable to change, invalid token'});
    }
})

module.exports = app => app.use('/auth', router);