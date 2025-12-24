const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require("../middleware/userMiddleware");
const {createProblem,getProblemById,updateProblem,getAllProblem,deleteProblem,solvedProblemsByUser,userSubmissionsOfAnyProblem,getProblemById_forAdmin} = require('../controllers/userProblem');
const problemRouter = express.Router();



// Create [Admin Access]
problemRouter.post("/create",adminMiddleware, createProblem);


// // Fetch all problems
problemRouter.get("/allproblems", userMiddleware,getAllProblem);

// // Update any problem [Admin Access]
problemRouter.put("/update/:id",adminMiddleware, updateProblem);

// // Delete any problem [Admin Access]
problemRouter.delete("/delete/:id", adminMiddleware,deleteProblem);

// // all solved problems by a user
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedProblemsByUser);

// Fetch any particular problem
problemRouter.get("/:id", userMiddleware,getProblemById);

// Fetch any particular problem by admin [return hidden test case and ref solution also]
problemRouter.get("/problemForAdmin/:id", adminMiddleware,getProblemById_forAdmin);

// fetch all the submissions for a particular problem by any user
problemRouter.get("/userSubmissions/:pid",userMiddleware,userSubmissionsOfAnyProblem);





module.exports = problemRouter;