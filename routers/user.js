const express = require('express')
const User = require('../models/User')
const {
    getAllUsers,
    createNewUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/user')
const router = new express.Router()

router
    .route('/users')
    .get(getAllUsers)
    .post(createNewUser)

router
    .route('/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router