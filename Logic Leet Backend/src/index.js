const express = require('express');
const app = express();
require('dotenv').config()
const cookieParser =  require('cookie-parser')
const main = require("./config/db")
const client = require("./config/redis_db");


const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemHandler");
const submitRouter = require('./routes/submit')
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const cors = require('cors')

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json()); // converts json req.body into JS Object
app.use(cookieParser()); //middleware lets Express read and parse cookies from the Cookie header in incoming requests.

app.use("/user",authRouter); //authRouter will handle the /user request  
app.use("/problem",problemRouter); //problemRouter will handle the /problem request  
app.use("/submission",submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);

async function initializeConnection(){


    try{


        
        await client.connect();
        console.log("Connected To Redis");
        
        await main();
        console.log("Connected to DB");

    app.listen(process.env.PORT,()=>{
    console.log("Server listening at port number: "+ process.env.PORT);

})


    }
    catch(err){
        console.error(err);


    }

    
}

initializeConnection();

    