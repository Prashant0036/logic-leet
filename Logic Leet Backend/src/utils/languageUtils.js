
// Ref : https://ce.judge0.com/languages

const axios = require('axios');

require('dotenv').config();


const waiting = async (ms) => new Promise(resolve => setTimeout(resolve, ms));


const getIdByLanguage = (language)=>{

language = language.toLowerCase();


const languageId = {


    
    "c++":105,
    'java':91,
    'python':113,
    'javascript':102
    
}

return languageId[language];
   


}

const submitBatch = async (submissions)=>{


    // We'll make axios request rather normal fetch http API request:
    // axios is built on top of fetch

    // 1: don't have to do resonse.JSON() to convert in to JSON object
    // 2: don't have to check error code it does automatically
    // 3: Browser and Server both compatability


// console.log(submissions);

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_RAPID_API_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions: submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		// console.log(response.data);
        // this POST request, first it will return an array of tokens for every code of a batch
        // then we've to make a GET call again with token to get status_id
        // https://ce.judge0.com/#statuses-and-languages-status-get
        return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}

const submitToken = async(tokenArray)=>{


const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokenArray.join(","),
    // tokenArray.join(",") : made a , seapareted string from token array
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_RAPID_API_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		// console.log(response.data);
        return response.data;
	} catch (error) {
		console.error(error);
	}
}

while(true){

    const result =  await fetchData();
    
    // result = {
        //   "submissions": [
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
        // }
        
        // status_id : 1 -> In Queue
        // status_id : 2 -> Processing
        // status_id : 3 -> correct o/p 
        const isResultObtained = result.submissions.every((val)=>{return val.status_id>2});
        // .every returns a bool value after performing any opearation on each val of array
        
        
        if(isResultObtained) return result.submissions;

        await waiting(1000); 
        
    }


}





module.exports = {getIdByLanguage,submitBatch,submitToken};