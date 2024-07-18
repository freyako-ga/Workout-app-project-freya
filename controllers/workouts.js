const express = require('express')
const router = express.Router()
const Workout = require('../models/workout.js')
const User = require('../models/user.js')


router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find()
    res.render('workouts/index.ejs', {
      workouts
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// GET /workouts/new
router.get('/new', (req, res) => {
  try {
    res.render("workouts/new")
  } catch (error) {
    console.log(error.message)
    res.redirect('/')
  }

});



// /workouts/create

router.post("/", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      throw new Error("User is not logged in or user ID is missing.");
    }
    req.body.owner = req.session.user._id;
    
    const createdWorkout = await Workout.create(req.body);
    res.redirect('/workouts');
  } catch (error) {
    console.error("Error creating workout:", error.message);
    res.status(422).render('workouts/new.ejs', { errorMessage: error.message });
  }
});





// /workouts/show

router.get("/:workoutId", async (req, res) => {
  try {
    const workoutId = req.params.workoutId
    const foundWorkout = await Workout.findById(req.params.workoutId);
    if (!foundWorkout) throw new Error('Workout not found')

    res.render("workouts/show.ejs", { workout: foundWorkout });
  } catch (error) {
    res.status(404).render('error', { errorMessage: error.message })
  }
});


// GET /workouts
router.get("/workouts", async (req, res) => {
  const allWorkouts = await Workout.find();
  res.render("workouts/index.ejs", { workouts: allWorkouts });
});


// delete 
router.delete("/:workoutId", async (req, res) => {
  try {
    const workoutId = req.params.workoutId
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.workoutId);
    if (!deletedWorkout) throw new Error('Exercise not found')
    req.session.message = 'Successfully deleted exercise'
    res.redirect("/workouts");
  } catch (error) {
    res.render('error', { errorMessage: error.message })
  }
});

// edit
router.get("/:workoutId/edit", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId)
    if (!workout) throw new Error ('Exercise not found')
      console.log(workout)

    if (workout.owner.equals(req.session.user._id)) {
      res.render('workouts/edit', { workout: workout })
    } else {
      res.redirect(`/workouts/${workout._id}`)
    }
  } catch (error) {
    console.log (error)
    res.render('error', { errorMessage: error.message })
  }
})



// update

router.put('/:workoutId', async (req, res) => {
  try {
   const workoutToUpdate = await Workout.findById(req.params.workoutId)
   if (!workoutToUpdate) throw new Error()
    


  //Check ownership
  if (workoutToUpdate.owner.equals(req.session.user._id)) {
    await workoutToUpdate.updateOne(req.body)
    res.redirect(`/workouts/${workoutToUpdate._id}`)
  } else {
    //return an error message
    res.send('You do not have permission to udpate this listing')
  }
} catch (error) {
  console.log(error)
  res.redirect('/workouts')
}
})

module.exports = router