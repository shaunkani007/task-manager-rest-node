const express = require('express')
const Task = require('../models/Task')
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
    .get(getAllTasks)
    .post(createNewTask)

router
    .route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(deleteTask)

module.exports = router