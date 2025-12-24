const { response } = require("express");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getIdByLanguage, submitBatch,submitToken } = require("../utils/languageUtils");


const submitCode = async (req,res)=>{

    try{

        const userId = req.result._id; // pre saved it in userMiddleware
        const problemId = req.params.id;
        let {code,language } = req.body; // will get from frontEnd
        language = language.toLowerCase();
        
       

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Some Fields are missing");
        }

        // fetch the problem from data base
        const problemDoc = await Problem.findById(problemId);

        // First Store the user submitted code in db, then we'll do anything 

        const submitResult = await Submission.create({
                 userId,problemId,code,language,status:"Pending",testCasesTotal:problemDoc.hiddenTestCases.length
        })

        // Now, we'll submit user's code to judge0 

        // On Submit -> Run Hidden TestCases
        // On Run -> Run Visible TestCases
        
        const languageId = getIdByLanguage(language);

        // Now prepare a submissions array, to do batch submission as we've to run same code on different hidden test cases

         const submissions = problemDoc.hiddenTestCases.map((testCase)=>(
                    {
                       source_code : code,
                       language_id:languageId,
                       stdin:testCase.input,
                       expected_output:testCase.output
                       
                }

            ))

        // console.log(submissions);

        const batchSubmission = await submitBatch(submissions);
        const tokenArray = batchSubmission.map((val)=>val.token);

const testResults = await submitToken(tokenArray);



// Now in testResult, we've result of each hidden test case



// Now it's time to update the Submission table

let testCasesPassed = 0;
let totalTimeTaken = 0; 
let maxMemoryNeeded = Number.MIN_SAFE_INTEGER;
let status = 'Accepted';
let errorMessage = null;
for (const testResult of testResults){

if (testResult.status_id == 3){
testCasesPassed++;
totalTimeTaken += parseFloat(testResult.time);
maxMemoryNeeded = Math.max(maxMemoryNeeded,testResult.memory);
}
else if(testResult.status_id == 4){
status = 'Wrong Answer';
errorMessage = testResult.stderr;
break;
}
else if(testResult.status_id == 5){
status = 'Time Limit Exceeded';
errorMessage = testResult.stderr;
break;
}
else if(testResult.status_id > 6){
status = 'Runtime Error';
errorMessage = testResult.stderr;
break;
}



}



// store the results in database
// submitResult was returned instance of initial creation
submitResult.status = status;
submitResult.memory = maxMemoryNeeded;
submitResult.errorMessage = errorMessage;
submitResult.testCasesPassed = testCasesPassed;
submitResult.runtime = totalTimeTaken;


await submitResult.save();

// Now we'll add problemId in problem solved by user if it's not present before
if(status == "Accepted"){


    
// add problem in problemSolved array of user, if it's not solved before
const userDoc = req.result;
if( !userDoc.problemSolved.includes(problemId)){
    userDoc.problemSolved.push(problemId);
    await userDoc.save();
}

}

 const accepted = (status == 'Accepted');

    res.status(201).json({
      accepted,
      totalTestCases: submitResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      totalTimeTaken,
      maxMemoryNeeded
    });



    }
    catch(err){
        res.status(400).send(err.message);
    }
}


const runCode = async (req,res)=>{

    try{

        const userId = req.result._id; // pre saved it in userMiddleware
        const problemId = req.params.id;
        const {code,language } = req.body; // will get from frontEnd

       

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Some Fields are missing");
        }

        // fetch the problem from data base
        const problemDoc = await Problem.findById(problemId);

        
        // Now, we'll submit user's code to judge0 to run 

        // On Submit -> Run Hidden TestCases
        // On Run -> Run Visible TestCases
        
        const languageId = getIdByLanguage(language);

        // Now prepare a submissions array, to do batch submission as we've to run same code on different hidden test cases

         const submissions = problemDoc.visibleTestCases.map((testCase)=>(
                    {
                       source_code : code,
                       language_id:languageId,
                       stdin:testCase.input,
                       expected_output:testCase.output
                       
                }

            ))

        // console.log(submissions);

        const batchSubmission = await submitBatch(submissions);
        const tokenArray = batchSubmission.map((val)=>val.token);

const testResults = await submitToken(tokenArray);



// Now in testResult, we've result of each visibleTest case

let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const testResult of testResults){
        if(testResult.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(testResult.time)
           memory = Math.max(memory,testResult.memory);
        }else{
          if(testResult.status_id==4){
            status = false
            errorMessage = testResult.stderr
          }
          else{
            status = false
            errorMessage = testResult.stderr
          }
        }
    }







 res.status(201).json({
    success:status,
    testCases: testResults,
    runtime,
    memory
   });



    }
    catch(err){
        res.status(400).send(err.message);
    }
}

module.exports = {submitCode,runCode};