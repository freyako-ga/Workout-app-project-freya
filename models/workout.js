const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
    name: String,
    description: String,
  });


const Workout = mongoose.model("Workout", workoutSchema); 


module.exports = Workout
