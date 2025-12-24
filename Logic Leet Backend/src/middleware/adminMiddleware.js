
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const client = require("../config/redis_db");
const cookieParser =  require('cookie-parser')
const express = require('express');
const authRouter = express.Router();
require('dotenv').config()
authRouter.use(cookieParser());

const adminMiddleware = async (req,res,next)=>{


try{


const {token} = req.cookies;

 
    

    if(!token){
        throw new Error("Token is not present");
    }


    // extract payload from token
    const payload = await jwt.verify(token,process.env.JWT_KEY);
    // console.log(payload);

    const {_id} = payload; // extract _id from payload, we saved _id and email in payload while token generation
    // console.log(_id);
    if(!_id){
            throw new Error("Invalid token");
        }


    const result = await User.findById(_id);

    if(!result){
        throw new Error("User doesn't exist");
    }
  


    // Only payload with having role:admin can register new admin
    if(payload.role!="admin"){
        throw new Error("Admin Access Needed");
    }

    // check if token is present in Redis db Blocklist
    
    const isBlocked = await client.exists(`token:${token}`);
    if(isBlocked) throw new Error("Invalid Token");
    
    
    // console.log(result);
    req.result=result; // attach admin's doc with request for future need


    next();

}
catch(err){

    res.status(401).send(err.message);
}



}


module.exports = adminMiddleware;