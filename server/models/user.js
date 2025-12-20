// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//   },
  
//   email: {
//     type: String,
//   },

//   phone : {
//     type : Number 
//   },

//   passwordHash: {
//     type: String,
//   },

//   accountTypes:{
//     type: String,
//     enum:['REGISTERED','GUEST'],
//     default:'REGISTERED'
//   },


//   role : {
//     type : String ,
//     enum : ['customer' , 'admin'],
//     default : 'customer'
//   },

//   isActive: {
//     type: Boolean,
//   },

//   totalSpend : {
//     type : Number
//   },

//   totalOrders : {
//     type : Number
//   },

//   loyalPoints : {
//     type : Number 
//   },

//   refreshToken: {
//     type: String,
//   },

//   refreshTokenExpiresTime : {
//     type : Date
//   },

//   lastlogin : {
//     type : Date,
//     default : null
//   },
//   // 🔐 FORGOT PASSWORD FIELDS (REQUIRED)
//   resetPasswordToken: {
//     type : String,
//     default: null
//   },
//   resetPasswordExpire: {
//     type : Date,
//     defoult : null
//   },
// });

// const User = mongoose.model('User', userSchema);

// export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: Number,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    accountTypes: {
      type: String,
      enum: ["REGISTERED", "GUEST"],
      default: "REGISTERED",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalSpend: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    loyalPoints: {
      type: Number,
      default: 0,
    },

    refreshToken: {
      type: String,
    },

    refreshTokenExpiresTime: {
      type: Date,
    },

    lastlogin: {
      type: Date,
      default: null,
    },

    // 🔐 FORGOT PASSWORD
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
