const useUser = require('../../../Database/use_cases/crudUser');
const express = require('express');
// const sendToken = require('../../../modules/twilio');

const router = express.Router();

router.post('/signup/', (req, res) => {
    try {
        useUser.create(req.body).then(data => {
            res.status(200).send(data)
        })
    } catch {
        res.status(401).send({ msg: "There is already this cde" })
    }
})

router.get('/login/token', (req, res) => {
    try {
        useUser.read_token(req.headers.authorization).then(data => {
            res.status(200).send(data)
        })
    } catch {
        res.status(401).send({ msg: 'There is no token' })
    }
})

router.get('/login/notToken', (req, res) => {
    useUser.read_login(req.headers.login, req.headers.psswrd).then(token => {
        if (token === '') {
            res.status(401).send({ msg: 'Invalid login' })
        } else {
            const userData = useUser.read_token(token)
            res.status(200).send({ user: userData, token: token })
        }
    })
})

router.post('/reset/psswrd', (req, res) => {
    try {
        const body = req.body
        useUser.setResetPassword(body.cde).then(response => {
            const token = response.token
            // await sendToken(token, response.number)
            console.log(token);
            res.status(200).send({ msg: 'everything is okay' })
        })
    } catch {
        res.status(404).send({ msg: 'unable to do it' })
    }
})

router.patch('/update/:newPsswrd/:token', (req, res) => {
    const user = req.body
    useUser.checkChangePsswrd(user.cde, req.params.token).then(data => {
        if (data) {
            useUser.changePassword(user.cde, req.params.newPsswrd);
            res.status(200).send({ msg: 'Changed! Try to log in again!' })
        } else {
            res.status(401).send({ msg: 'Unable to change, invalid token' });
        }
    })
})

module.exports = app => app.use('/auth', router);