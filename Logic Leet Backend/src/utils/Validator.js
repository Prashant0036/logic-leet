// use validator library to check characteristics of the credentials
const validator = require("validator");

const validate = (data)=>{
// data is req.body
    
console.log(data);

// 1. Validate Required Field
const mandatoryFields = ["firstName","emailId","password"];
// console.log("Here in");
const isAllowed = mandatoryFields.every((field)=>Object.keys(data).includes(field));
// console.log("->",isAllowed);
if(!isAllowed){
    
    console.log("Required Fields Missing");
    throw new Error("Required Fields Missing");
} 


// 2. Validate Email
if(!validator.isEmail(data.emailId)) {
    throw new Error("Email is Invalid");
}

// 3. Check Password is Strong or Not
if(!validator.isStrongPassword(data.password)){
   
    throw new Error("Password is weak - should have atleast 1 Uppercase, 1 Lowercase, 1 Special Case, 1 Number ");
}

}



module.exports = validate;