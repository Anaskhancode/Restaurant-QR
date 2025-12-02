import bcrypt from 'bcrypt';
import User from '../models/user.js';

export const register = async(req, res)=>{

try {
    const { name, email, password, phone } = req.body;
    //check if user is registered
    const userData = await User.findOne({ email });

    if (userData) {
      res.status(400).json({
        message: 'you are already registered , Please login',
      });
    }

    //if user is not registered , hash the password
    const passwordHash = await bcrypt.hash(password, 12);
    const data = { name, email, phone, passwordHash };
    const newUser = await User.create(data);
    res.status(201).json({
      messsage: 'success',
      data: newUser,
    });
  }
  
  
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};






