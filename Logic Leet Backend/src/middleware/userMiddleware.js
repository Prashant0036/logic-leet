const jwt = require("jsonwebtoken");
const User = require("../models/user");
const client = require("../config/redis_db");
const cookieParser =  require('cookie-parser')
const express = require('express');
const authRouter = express.Router();
require('dotenv').config()
authRouter.use(cookieParser());


const userMiddleware = async (req,res,next)=>{
  

try{

    
    // console.log(req);
    const {token} = req.cookies; // will show undefined with out cookie-parser
    // console.log(token);
    

    if(!token){
        throw new Error("Token is not present");
    }


    // extract payload from token
    const payload = await jwt.verify(token,process.env.JWT_KEY);
    // console.log(payload);

    const {_id} = payload; // extract _id from payload, we saved _id and email in payload while token generation

    if(!_id){
            throw new Error("Invalid token");
        }


    const result = await User.findById(_id);

    if(!result){
        throw new Error("User doesn't exist");
    }

    // check if token is present in Redis db Blocklist
    
    const isBlocked = await client.exists(`token:${token}`);
    if(isBlocked) throw new Error("Invalid Token");
    
 
    req.result=result; // save userDoc in req.result for future use 

    next();

}
catch(err){

    res.status(401).send(err.message);
}


}



module.exports = userMiddleware