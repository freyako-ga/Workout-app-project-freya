// Imports

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const Workout = require('./models/workout.js')
const User = require('./models/user.js')

// Controllers / routes
const authController = require('./controllers/auth.js')

// Constants
const app = express()
const port = process.env.PORT || 3000
console.log(port)

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.set('view engine', 'ejs')

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, //secret used to encrypt and decrpyt data in session
    resave: false, // don't need to force a save on an unmodified session
    saveUninitialized: true, //enforce a save of a new session that has yet to be saved
store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
})
}))



// Landing page
app.get('/', async (req, res) => {
    res.render('index', {
        user: req.session.user
    })
})

// /auth
app.use('/auth', authController)


// Connections
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connection established')
        app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

connect()