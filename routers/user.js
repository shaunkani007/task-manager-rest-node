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

router.get('/all', auth, getAllUsers)

router
    .route('/')
    .get(auth, getUser)
    .post(createNewUser)
    .patch(auth, updateUser)
    .delete(auth, deleteUser)

module.exports = router