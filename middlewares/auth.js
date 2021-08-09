const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
    try {
        const token = req.headers['token']
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        const user = await User.findById({ _id: decoded._id, "tokens.token": token })
        if (!user) {
            throw new Error('Some problem')
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.send({ msg: 'Please authenticate' })
    }
}

module.exports = { auth }