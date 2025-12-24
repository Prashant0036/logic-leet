const mongoose = require("mongoose");
require('dotenv').config()
async function main(){

await mongoose.connect(process.env.DATABASE_URI_STRING)

}


module.exports  = main;