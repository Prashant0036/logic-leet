// import our user schema first

const User = require("../models/user");
const validate = require("../utils/Validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const express = require("express");
const client = require("../config/redis_db");
const Submission = require("../models/submission");

const authRouter = express.Router();
// replace app with authRouter
authRouter.use(express.json()); // converts json req.body into JS Object


const register = async (req,res)=>{

try{
     

    // first validate these credentials, like password length, @ in email...
    
    validate(req.body);
   
    // we are here means required fields are there in req.body

    const {firstName,emailId,password} = req.body;
    
// we don't have to handle existing email problem because in user schema
// we've told unique : true
// isEmailExist = User.exists(emailId);


// Now convert password into 256 Hash
req.body.password = await bcrypt.hash(password,10);
req.body.role ="user" // register by forced as a user
const user = await User.create(req.body); // create a db entry 


// Now after sign up we are giving login token to user
// user doesn't have to again login 

var token = jwt.sign({_id : user._id, emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})
                              //payload                      key              expiry
// randomSecretKey : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


// set token in res.cookie as key value pair
res.cookie("token",token,{maxAge:60*60*1000}); // maxAge will expire token entry from res.cookie after given mili second


 const reply = {
            firstName : user.firstName,
            emailId : user.emailId,
            role:user.role,
            _id : user._id
        
        }
// res.status(201).send("User Registered Successfully");
 res.status(200).json({
            
            user : reply,
            msg : "Register Successfull"
        });


}

catch(error)
{

res.status(400).send(error.message);

}


}


const login = async(req,res)=>{

    // check user has given email and pass or not
    // extract user's data (object) and compare password
    // provide token 
    try{
        
        
          const {emailId,password} = req.body; // given by user
        //   console.log(password);

          if(!emailId) throw new Error("Invalid Credentials");
          if(!password) throw new Error("Invalid Credentials");

         const userData =  await User.findOne({emailId:emailId});
        //  console.log(userData.password); 

         // compare password 
         const matchPassword = await bcrypt.compare(password,userData.password) ;
        
        //  console.log(matchPassword);
         if(!matchPassword){
            throw new Error("Invalid Credentials");
         }



         // provide token
         var token = jwt.sign({_id : userData._id, emailId:emailId,role:userData.role},process.env.JWT_KEY,{expiresIn:60*60})
         res.cookie("token",token,{maxAge:60*60*1000}); // maxAge will expire token entry from res.cookie after given mili second
        //  console.log(token);


        const reply = {
            firstName : userData.firstName,
            emailId : userData.emailId,
            solvedProblems : userData.problemSolved,
            role:userData.role,
            _id : userData._id
        
        }


        //  res.status(200).send("Login Successfully");
         res.status(200).json({
            
            user : reply,
            msg : "Login Successfull"
        });
    }
    catch(error){
         
 res.status(401).json({
        success: false,
        message: error.message
    });

    }



}

const makeAdmin = async (req,res)=>{

 try{
        
        
          const emailId = req.params.emailId; // given by Admin
        //   console.log(emailId)

 const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Already admin to nhi h
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin',
      });
    }

    //  Updated role
    user.role = 'admin';
    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async(req,res)=>{

try{

    console.log("Passesd Middleware");

    // validate the token [Done using userMiddleware]

    // add token in Redis blocklist

    const {token} = req.cookies; 

   const payload = jwt.decode(token);
   // we extract the payload from token coming with request
   // to know how much time left in expiry of this token from payload.exp

   await client.set(`token:${token}`,"Blocked");
   await client.expireAt(`token:${token}`,payload.exp); // remove entry from redis when token is expired



    // clear the token from cookie and expire it now
    res.cookie("token",null, {expires : new Date(Date.now())}); 
    res.send("Logout Successfully");

}

catch(error){
res.status(503).send(error.message);

}

}

const adminRegister=async(req,res)=>{

    try{
     
    // first validate these credentials, like password length, @ in email...
    // console.log(req.body);
    validate(req.body);
   
    // we are here means required fields are there in req.body

    const {firstName,emailId,password} = req.body;
    
// we don't have to handle existing email problem because in user schema
// we've told unique : true
// isEmailExist = User.exists(emailId);


// Now convert password into 256 Hash
req.body.password = await bcrypt.hash(password,10);
req.body.role ="admin" // register as a admin
const user = await User.create(req.body); // create a db entry 


// Now after sign up we are giving login token to user
// user doesn't have to again login 

var token = jwt.sign({_id : user._id, emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})
                              //payload                      key              expiry
// randomSecretKey : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


// set token in res.cookie as key value pair
res.cookie("token",token,{maxAge:60*60*1000}); // maxAge will expire token entry from res.cookie after given mili second
res.status(201).send("Admin Registered Successfully");

}

catch(error)
{
res.status(400).send(error.message);
}

}

const deleteProfile = async (req,res)=>{

    try{

        const userId = req.result._id; // pre saved in userMiddleware

        await User.findByIdAndDelete(userId);


        // delete all the submissions as well

        await Submission.deleteMany({userId : userId});


    }
    catch(err){

        res.status(500).send(err.message);
    }

}

module.exports = {register,login,logout,adminRegister,deleteProfile,makeAdmin};