const express = require('express')
const User = require('../models/User')

getUser = async(req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
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
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        const user = await User.findById(req.params.id)
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
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = { getAllUsers, createNewUser, getUser, updateUser, deleteUser }