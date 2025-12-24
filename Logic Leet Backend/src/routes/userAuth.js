const express = require("express");

const authRouter = express.Router();



const {register,login,logout,adminRegister,deleteProfile,makeAdmin} = require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Register
authRouter.post("/register",register); // register handle separately from controllers


//Login
authRouter.post("/login",login); 


// Logout
authRouter.post("/logout",userMiddleware,logout);


// Admin Register -> Only one admin can register another admin
// first we've to parse through adminMiddleware to verify identity
authRouter.post("/admin/register",adminMiddleware,adminRegister);

// Get Profile
// authRouter.get("/getProfile",getProfile);


// Delete Profile
authRouter.delete("/deleteProfile",userMiddleware,deleteProfile);

//Make another user as admin
authRouter.patch("/makeAdmin/:emailId",adminMiddleware,makeAdmin);


// check any visitor is authentic or not
authRouter.get("/check",userMiddleware,(req,res)=>{

// req.result m userDoc ko store kar diya tha userMiddleware m 
const reply = {
            firstName : req.result.firstName,
            emailId : req.result.emailId,
            solvedProblems : req.result.problemSolved,
            _id :req.result._id,
            role:req.result.role
        
        }

    res.status(200).json({
        user:reply,
        msg:"Valid User"
    })
})

module.exports = authRouter;



