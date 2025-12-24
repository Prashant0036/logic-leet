const mongoose = require("mongoose");

// we'll define the Problem Schema in this file

const { Schema } = mongoose;

const problemSchema = new Schema({

title :{

    type:String,
    required:true

},

description:{
type:String,
required:true

},
difficulty:{
    type:String,
    enum : ["Easy","Medium","Hard"],
required:true


},
tags:{
type:String,
required:true

},

// In visibleTestCases, there can be many testcases that's why wrap under an array
// visibleTestCases[0] means 1 test case
visibleTestCases:[

    {
        input:{
            type:String,
            required:true
        },

        output:{
             type:String,
            required:true
        },
        explanation:{
             type:String,
            required:true
        }


    }


],
hiddenTestCases:[

    {
        input:{
            type:String,
            required:true
        },

        output:{
             type:String,
            required:true
        }

    }


],
templateCode:[

{
language:{

    type : String,
    required:true,

},
boilerPlate:{
 type : String,
required:true,

}

}

],

referenceSolution:[

    {
        language:{
    type : String,
    required:true,

},
completeCode:{
 type : String,
required:true,

}

    }
],
problemPublisher:{

    // store the Object ID(mongo DB ID) of whom, who created the problem
    // this is how we made relation b/w collection
    type : Schema.Types.ObjectId,
    ref:'user',  // will be from user collection that we created
    required:true
}
}) 


// Now create table following problemSchema template

const Problem = mongoose.model("problem",problemSchema);
module.exports = Problem;