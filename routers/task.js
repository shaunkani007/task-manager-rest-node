const express = require('express')
const { auth } = require('../middlewares/auth')
const {
    getTask,
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask
} = require('../controllers/task')
const router = new express.Router()

router
    .route('/')
    .get(auth, getAllTasks)
    .post(auth, createNewTask)

router
    .route('/:id')
    .get(auth, getTask)
    .patch(auth, updateTask)
    .delete(auth, deleteTask)

module.exports = router