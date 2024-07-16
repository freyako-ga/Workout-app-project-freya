// GET /workouts
router.get("/workouts", async (req, res) => {
    const allWorkouts = await Workout.find();
    res.render("workouts/index.ejs", { workouts: allWorkouts });
  });
      
 

// GET /workouts/new
router.get("/workouts/new", (req, res) => {
    res.render("/workouts/new")
  });
  

  router.get("/workouts/:workoutId", async (req, res) => {
    const foundWorkout = await Workout.findById(req.params.workoutId);
    res.render("workouts/show.ejs", { workout: foundWorkout });
  });
  

// POST /workouts
router.post("/workouts", async (req, res) => {
     await Workout.create(req.body);
    res.redirect("/workouts/new.ejs");
  });

  // delete
  router.delete("/workouts/:workoutId", (req, res) => {
    res.send("This is the delete route");
  });
  

  router.delete("/workouts/:workoutId", (req, res) => {
    await Workout.findByIdAndDelete(req.params.workoutId);
    res.redirect("/workouts");
  });
  