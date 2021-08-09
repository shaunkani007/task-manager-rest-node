const express = require('express')
const { auth } = require('../middlewares/auth')
const User = require('../models/User')

const {
    loginUser,
    signOutUser,
} = require('../controllers/auth')
const router = new express.Router()

router
    .route('/login')
    .post(loginUser)

router.route('/logout').post(auth, signOutUser)

module.exports = router