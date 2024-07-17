

const mongoose = require('mongoose')



const workoutSchema = new mongoose.Schema({

    name: { 
    type: String,
    required: [true, 'Name is required'],
    unique: true
    },

    description: {
        type: String,
        required: [true, 'Description is required']
    },

  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Workout = mongoose.model("Workout", workoutSchema); 


module.exports = Workout
