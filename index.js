const express = require('express')
const { connectDB } = require('./db')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const authRouter = require('./routers/auth')
const dotenv = require('dotenv')

dotenv.config({ path: './conf/config.env' })
const app = express()
connectDB()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})