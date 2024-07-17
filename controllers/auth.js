const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

//Routes / Controllers

// GET /auth/sign-up
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up')
})


// POST /auth/sign-up
router.post('/sign-up', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
        return res.send('Username already taken')
    }

    //2. Checking password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords do not match')
    }


    //3. Hashing plain text password for secuirty purposes. (it defaults to 10 rounds of password tries)
    req.body.password = bcrypt.hashSync(req.body.password, 12)

    //4. Create the user document
    const user = await User.create(req.body)
    return res.send(`Thanks for signing up, ${user.username}`)

})

// /auth/sign-in
router.get('/sign-in', (req, res) => {
    return res.render('auth/sign-in')
})

router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
        return res.send('Login failed. Please try again.')
    }

    // There is a user! Test their password with bcrypt
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
    if (!validPassword) {
        return res.send('Login Failed. Please try again.')
    }


    //If it reaches this point, the user is validated, now need to provide a session

    // Add username to session user

    req.session.user = {
        username: userInDatabase.username
    }
    //Once authenticated and session saved, redirect back to the homepage
    req.session.save(() => {
        res.redirect('/workouts')
    })
});

// Sign out
// GET /auth/sign-out
router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})


module.exports = router

