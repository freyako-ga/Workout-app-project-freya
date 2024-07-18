const mongoose = require('mongoose')
require('dotenv').config()

//model
const User = require('../models/user.js')
const Workout = require('../models/workout.js')

//data
const userData = require('./data/users.js')
const workoutData = require('./data/workouts.js')

const seedDatabase = async () => {
    try {
        //1. connecting to the database
        await mongoose.connect(process.env.MONGODB_URI)
        console.log()
        //2. Remove all data from the database
        const deletedUsers = await User.deleteMany()
        console.log(`${deletedUsers.deletedCount} users deleted from the database`)

        const deletedWorkouts = await Workout.deleteMany()
        console.log(`${deletedUsers.deletedCount} users deleted from the database`)


        //3. Create new users in the database
        const users = await User.create(userData)
        console.log(`${users.length} users added into the database`)

        const workoutsWithOwners = workoutData.map(workout => {
            workout.owner = users[Math.floor(Math.random() * users.length)]._id
            return workout

        })

        //4. Create new listings in the database
        const workouts = await Workout.create(workoutsWithOwners)
        console.log(workouts)
        //5. closing our connection to the database
        await mongoose.connection.close()
        console.log('Database connection closed. Goodbye!')
    } catch (error) {
        console.log(error)
    }

    // 6. 
    await mongoose.connection.close()
    console.log('Database connection closed. Goodbye!')



}

seedDatabase()