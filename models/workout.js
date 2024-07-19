const mongoose = require('mongoose')



const workoutSchema = new mongoose.Schema({

    name: { 
    type: String,
    required: [true, 'Name is required'],
    unique: true
    },

    description: {
        type: String
    },

  owner: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Workout = mongoose.model("Workout", workoutSchema); 


module.exports = Workout
