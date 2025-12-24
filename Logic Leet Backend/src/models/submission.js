const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['c++', 'java','python','javascript'] 
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Wrong Answer', 'Runtime Error','Time Limit Exceeded'],
    default: 'Pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {  
    // Recommended addition
    type: Number,
    default: 0
  }
}, { 
  timestamps: true  // when the entry was registered
});


submissionSchema.index({userId:1,problemId:1});
// why we create indexing on combo of userId and problemId 
// becuase while fetching al the submissions of particular problem by particular user
// we'll search like Submission.findMany({userId,problemId})
// but in MongoDB only _id is indexing based (use Binary Search because sorted)
// so it'll go linearly in table and will match ({userId,problemId}) 1 by 1

const Submission = mongoose.model('submission',submissionSchema);
// create table submission 

module.exports = Submission;