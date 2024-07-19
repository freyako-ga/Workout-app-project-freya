// Imports

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const Workout = require('../../models/workout.js')
const User = require('../../models/user.js')
const path = require('path')
const serverless = require('serverless-http')

// Controllers / routes
const authController = require('./controllers/auth.js')
const workoutsController = require('./controllers/workouts.js')
const passUserToView = require('./middleware/pass-user-to-view.js')
const isSignedIn = require('./middleware/is-signed-in.js')

// Constants
const app = express()


mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use(express.static("public"));





// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, //secret used to encrypt and decrpyt data in session
    resave: false, // don't need to force a save on an unmodified session
    saveUninitialized: true, //enforce a save of a new session that has yet to be saved
store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
})
}))

app.use(passUserToView)




// Landing page
app.get('/', async (req, res) => {
    res.render('index')
})

app.use('/auth', authController)
app.use('/workouts', isSignedIn, workoutsController)

//404 page not found
app.get('*', (req,res) => {
    res.status(404).render('404')
})

// Connections
module.exports.handler = serverless(app)
connect()