const useUser = require('../../../Database/use_cases/crudUser');
const express = require('express');
// const sendToken = require('../../../modules/twilio');

const router = express.Router();

router.post('/signup/', (req, res) => {
    try {
        useUser.create(req.body).then(data => {
            res.status(200).send({
                status: 200,
                msg: 'SignUp sucessfully',
                content: { token: data }
            })
        })
    } catch {
        res.status(401).send({
            status: 401,
            msg: "There is already this cde",
            content: ''
        })
    }
})

router.get('/login/token', (req, res) => {
    try {
        const data = useUser.read_token(req.headers.authorization)
        res.status(200).send({
            status: 200,
            msg: 'LogIn sucessfully',
            content: { user: data }
        })
    } catch {
        res.status(401).send({
            status: 401,
            msg: "There is no token",
            content: ''
        })
    }
})

router.get('/login/notToken', (req, res) => {
    useUser.read_login(req.headers.login, req.headers.psswrd).then(token => {
        if (token === '') {
            res.status(401).send({
                status: 401,
                msg: "Invalid login",
                content: ''
            })
        } else {
            const userData = useUser.read_token(token)
            res.status(200).send({
                status: 200,
                msg: 'LogIn sucessfully',
                content: { user: userData, token: token }
            })
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
            res.status(200).send({
                status: 200,
                msg: 'everything is okay',
                content: ''
            })
        })
    } catch {
        res.status(404).send({
            status: 404,
            msg: 'unable to do it',
            content: ''
        })
    }
})

router.patch('/update', (req, res) => {
    const user = req.body
    useUser.checkChangePsswrd(user.cde, req.headers.token).then(data => {
        if (data) {
            useUser.changePassword(user.cde, req.headers.newPsswrd);
            res.status(200).send({
                status: 200,
                msg: 'Changed! Try to log in again!',
                content: ''
            })
        } else {
            res.status(401).send({
                status: 401,
                msg: 'Unable to change, invalid token',
                content: ''
            });
        }
    })
})

module.exports = app => app.use('/auth', router);