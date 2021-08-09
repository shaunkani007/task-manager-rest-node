const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Task = require('./Task')
var jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//  To use this, add user.populuate('tasks').execPopulate(), then use user.tasks property
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// This method does not send password and tokens fields when we call res.send(user)
userSchema.methods.toJSON = function() {
    const obj = this.toObject()
    obj.delete.password
    obj.delete.tokens
    return obj
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByCredential = async function(username, password) {
    const user = await User.findOne({ name: username })
    if (!user) {
        throw new Error('No user')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
        return user
    }
    throw Error('Password and email mismatch')
}

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

// Remove evry task of deleted user
userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id })
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User