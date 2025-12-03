import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  
  email: {
    type: String,
  },

  phone : {
    type : Number 
  },

  passwordHash: {
    type: String,
  },

  accountTypes:{
    type: String,
    enum:['REGISTERED','GUEST'],
    default:'REGISTERED'
  },


  role : {
    type : String ,
    enum : ['customer' , 'admin'],
    default : 'customer'
  },

  isActive: {
    type: Boolean,
  },

  totalSpend : {
    type : Number
  },

  totalOrders : {
    type : Number
  },

  loyalPoints : {
    type : Number 
  },

  refreshToken: {
    type: String,
  },

  refreshTokenExpiresTime : {
    type : Date
  },

  lastlogin : {
    type : Date,
    default : null
  }
});

const User = mongoose.model('User', userSchema);

export default User;