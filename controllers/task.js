const express = require('express')
const Task = require('../models/Task')

getTask = async(req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.find({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

// ?completed=true&limit=2&skip=4&sortBy=createdAt:desc - query string
getAllTasks = async(req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const keyValue = req.query.sort.split(':')
        sort[keyValue[0]] = keyValue[1] === 'desc' ? -1 : 1
    }
    try {
        // Filtering data from querystring
        req.user
            .populuate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    // sort: {
                    //     // createdAt: -1 // descending, if ascending put it 1
                    //     completed: 1
                    // }
                    sort
                }
            })
            .execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
}

createNewTask = async(req, res) => {
    // const task = Task(req.body)
    const task = Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
}

updateTask = async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    )

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.find({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach(update => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
}

deleteTask = async(req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = { getAllTasks, createNewTask, getTask, updateTask, deleteTask }