const mongoose = require("mongoose");

// we'll define the User Schema in this file

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },

    lastName: {
      type: String,
      minLength: 3,
      kMaxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // inme se hi ek value hogi
      default: "user",
    },
    problemSolved: {
      type: [{
        type : Schema.Types.ObjectId,
        ref:"problem"
      }],

      unique:true
    },

    password :{
      type : String,
      required : true
    }
   
  },
  {
    timestamps: true,
  }
);


userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
      await mongoose.model('submission').deleteMany({ userId: userInfo._id });
    }
});


const User = mongoose.model("user",userSchema);
// it creates a mongoose model named User, now it'll work like a class
// having above attributes
// Now any new user can be created using User class
module.exports = User;
