const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");

const {getIdByLanguage,submitBatch,submitToken} = require("../utils/languageUtils");

const createProblem = async (req,res)=>{

const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,
    templateCode,referenceSolution} = req.body;
    console.log(req.body);
    // console.log(referenceSolution);

    // Note : we didn't take problemPublisher from req.body bcoz at the time user passes the admin check middleware 
    // we attached it's doc with req.result 
    // no we can extract the _id from doc and save it as problemPublisher



    // Now we'to test referenceSolution, provided by admin is correct or not
    // what we'll do :
    // first extract solution of every language from referenceSolution array

    // then [language+code+I/P+O/P] -> Judge0 -> yes or no

    // Docs : https://ce.judge0.com/#top 
    // https://ce.judge0.com/languages
    // Format of Judge0 input :

    /* {

    "source_code":"-----",
    "language_id":,
    "stdin":,
    "expected_output":


    }

    */

    try{


        for (const {language,completeCode} of referenceSolution){

// language = c++ and srcCode : adminSubmitted C++ Code for problem
                // get languageId from language
                const languageId = getIdByLanguage(language);

                // Run all visibleTestCases on Admin submitted Code in a single batch
// visibleTestCases[0] means 1 test case
                // console.log(language,":",languageId);
                const submissions = visibleTestCases.map((testCase)=>(
                    {
                       source_code : completeCode,
                       language_id:languageId,
                       stdin:testCase.input,
                       expected_output:testCase.output
                       
                }

                // in map function, every test case will have same srcCode and id
                // will be differ in input and output of each test case
                // through map function, we are creating objects for every testCase
                
            ))

            // Now for each language we are creating a separate batch and 
            // submitting to judge0

            const batchSubmission = await submitBatch(submissions);

            // https://ce.judge0.com/#submissions-submission-batch-post
        // this POST request, first it will return an array of tokens for every code of a batch
        // then we've to make a GET call again with token to get status_id
        // https://ce.judge0.com/#statuses-and-languages-status-get

        // Now, in batchSubmission we've :
//         [
//   {
//     "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
//   },
//   {
//     "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
//   },
//   {
//     "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
//   }
// ]

// extract the tokens in an array to make another GET request.
const tokenArray = batchSubmission.map((val)=>val.token);
// tokenArray = ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const testResults = await submitToken(tokenArray);

// testResult = [
//     {
//       "language_id": 46,
//       "stdout": "hello from Bash\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
//     },
//     {
//       "language_id": 71,
//       "stdout": "hello from Python\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
//     },
//     {
//       "language_id": 72,
//       "stdout": "hello from Ruby\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
//     }
//   ]

console.log(testResults);

for (const testResult of testResults){

if (testResult.status_id == 4){

res.status(400).send("Wrong Answer Found");
}
else if(testResult.status_id == 5){
res.status(400).send("Time Limit Exceeded");

}
else if(testResult.status_id == 6){
res.status(400).send("Compilation Error");

}
else if(testResult.status_id >6){
res.status(400).send("RunTime Error");

}


}
        }

        // if for loop has been executed, means all the source code of different languages
        // have passed all the test cases
        // Now we can store all stuf in database
        
        console.log("created by : ",req.result._id);
        await Problem.create({...req.body,problemPublisher:req.result._id});
        console.log("created in db");

        res.status(201).send("Problem Saved Successfully")
        
        
    
    }
    catch(err){
res.send(err.message);
    }
}

const getProblemById = async(req,res)=>{

    try{
        // console.log("here");
        const id = req.params.id;
        const problemDoc = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases templateCode referenceSolution');
        res.send(problemDoc);
    }
    catch(err){
        res.status(400).send(err.message);
    }



}
const getProblemById_forAdmin = async(req,res)=>{

    try{
        // console.log("here");
        const id = req.params.id;
        const problemDoc = await Problem.findById(id);
        // return full problemDoc 
        res.send(problemDoc);
    }
    catch(err){
        res.status(400).send(err.message);
    }



}



const updateProblem = async(req,res)=>{
    // console.log("here");

    try{
       
        const id = req.params.id;
        // console.log(id);
        
        if(!id) return res.status(400).send("Problem Id is missing");

        const problemDoc = await Problem.findById(id);
        if(!problemDoc) return res.status(404).send("No problem found with this id");
         
    

        // Now check, Updated Reference Code[Solution Code] is ok or not
        const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,
    templateCode,referenceSolution} = req.body;

    

        
        for (const {language,completeCode} of referenceSolution){

                const languageId = getIdByLanguage(language);
                const submissions = visibleTestCases.map((testCase)=>(
                    {
                       source_code : completeCode,
                       language_id:languageId,
                       stdin:testCase.input,
                       expected_output:testCase.output
                       
                }

     
                
            ))

        
            const batchSubmission = await submitBatch(submissions);


// extract the tokens in an array to make another GET request.
const tokenArray = batchSubmission.map((val)=>val.token);
// tokenArray = ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const testResults = await submitToken(tokenArray);


// console.log(testResults);

for (const testResult of testResults){

if (testResult.status_id == 4){

return res.status(400).send("Wrong Answer Found");
}
else if(testResult.status_id == 5){
return res.status(400).send("Time Limit Exceeded");

}
else if(testResult.status_id == 6){
return res.status(400).send("Compilation Error");

}
else if(testResult.status_id >6){
return res.status(400).send("RunTime Error");

}


}
        }


      const newProblemDoc =  await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        // {runValidators:true} -> schema constraint will be checked again
        // {new:true} -> return updated doc
        res.status(200).send(newProblemDoc);
        // res.status(200).send("Problem Updated Succesfully");
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

const getAllProblem = async(req,res)=>{

    try{

        const problemsDocArray = await Problem.find({}).select('_id title difficulty tags');
        // will return array of all problem docs

        // Rather we can send first 10 db Entries of each page
        // const Query = req.query;
        // const page = Query.page;
        // const limit = Query.limit;
        // const problemsDocArray = await Problem.find({}).skip(page-1).limit(limit);
        // skip (page -1) means, we are on 4th page on frontEnd, now skip the data of prev 3 pages (3*10) and then give data of next 10 entries.





        
        if(problemsDocArray.length == 0) return res.status(404).send("No Problmes Exist");
        
        res.status(200).send(problemsDocArray);
    }
    catch(err){
        res.status(400).send(err.message)
    }


}

const deleteProblem = async(req,res)=>{

    try{

const id = req.params.id;
const result = await Problem.findByIdAndDelete(id);
if(!result) throw new Error("Problem not exists");

res.status(200).send("Problem Deleted Successfully");
    }
    catch(err){
        res.status(404).send(err.message);
    }


}

const solvedProblemsByUser = async(req,res)=>{
try{

    const userDoc = req.result// pre saved in userMiddleware
    const userId = userDoc._id;


    const user = await User.findById(userId).populate({

        path : "problemSolved",
        select : "_id title difficulty tags"
    })

    // what populate is doing -> it's now refereing the end point of which object id is stored in problemSolved field
    
 
    res.status(200).send(user.problemSolved);

}
catch(err){
    res.status(500).send(err.message);
}
}

const userSubmissionsOfAnyProblem = async(req,res)=>{

    try{

       

        const userId = req.result._id;
        const problemId = req.params.pid;

        const allSubmissions = await Submission.find({userId:userId,problemId:problemId});
        // if(allSubmissions.length == 0 ) res.status(200).send("No Submission")
        // Previously, it was a bug because in frontend, response was No Submission not an empty array
        if(allSubmissions.length == 0 ) res.status(200).send([])
        res.status(200).send(allSubmissions);


    }
    catch(err){
        res.status(500).send(err.message);
    }

}

module.exports = {createProblem,getProblemById,updateProblem,getAllProblem,deleteProblem,solvedProblemsByUser,userSubmissionsOfAnyProblem,getProblemById_forAdmin};