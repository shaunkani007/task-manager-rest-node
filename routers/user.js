const express = require('express')
const User = require('../models/User')
const {
    getAllUsers,
    createNewUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/user')
const { auth } = require('../middlewares/auth')
const router = new express.Router()

router
    .route('/')
    .get(auth, getAllUsers)
    .post(createNewUser)

router
    .route('/:id')
    .get(auth, getUser)
    .patch(auth, updateUser)
    .delete(auth, deleteUser)

module.exports = router