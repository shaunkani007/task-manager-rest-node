const express = require('express')
const User = require('../models/User')

getUser = async(req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
}

getAllUsers = async(req, res) => {
    try {
        console.log(req.user)
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
}

createNewUser = async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            data: user,
            token: token
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

updateUser = async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    )

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = req.user
        updates.forEach(update => (user[update] = req.body[update]))
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

deleteUser = async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = { getAllUsers, createNewUser, getUser, updateUser, deleteUser }