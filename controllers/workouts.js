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
    res.render("/workouts/new")
  } catch (error) {
    console.log (error.message)
    res.redirect('/')
  }

});



// /workouts/create
router.post("/", async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    const createdWorkout = await Workout.create(req.body);
    res.redirect('/workouts')
  } catch (error) {
console.log(error.message)
  res.status(422).render('/workouts/new.ejs', { errorMessage: error.message})
}
});

// /workouts/show

router.get("/:workoutId", async (req, res) => {
  try {
    const workoutId = req.params.workoutId
    const foundWorkout = await Workout.findById(req.params.workoutId);
  if (!foundWorkout) throw new Error ('Workout not found')

  res.render("workouts/show.ejs", { workout: foundWorkout });
} catch (error) {
  res.status(404).render('error', {errorMessage: error.message })
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
if (!workout) throw new Error('Exercise not found')

  if (workout.owner.equals(req.session.user._id)) {
    res.render('workouts/edit.ejs', {workout: workout})
  } else {
    res.redirect(`/workouts/${workout._id}`)
  } 
}catch (error) {
   res.render('error', { errorMessage: error.message })
}
  })



// update

router.put(":workoutId", async (req, res) => {
  try {
const currentUser = await User.findById(req.session.user._id)
if (!currentUser) throw new Error('user not found')
  // Update the exercise in the database

const workout = currentUser.workouts.id(req.params.workoutId)
if (!workout) throw new Error('workout not found')
  workout.set(req.body)
await currentUser.save()
res.redirect(`/workouts/${req.params.workoutId}`)

  } catch (error) {
    console.log(error)
    res.render('404')
  }

});

module.exports = router