const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    //unique means no two usernames can be the same
    password: { type: String, require: true }
})

const User = mongoose.model('User', userSchema)


module.exports = User