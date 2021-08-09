const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

loginUser = async(req, res, next) => {
    try {
        const user = await User.findByCredential(req.body.name, req.body.password)
            // req.user = user
        const token = await user.generateAuthToken()
        res.send({ "token": token, data: user })
    } catch (e) {
        res.status(500).send()
    }
}

signOutUser = async(req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = { loginUser, signOutUser }