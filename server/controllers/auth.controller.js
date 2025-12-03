import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";



export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    //check if user is registered
    const userData = await User.findOne({ email });

    if (userData) {
      res.status(400).json({
        message: "you are already registered , Please login",
      });
    }

    //if user is not registered , hash the password
    const passwordHash = await bcrypt.hash(password, 12);
    const data = { name, email, phone, passwordHash };
    const newUser = await User.create(data);
    res.status(201).json({
      messsage: "success",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      res.status(400).json({
        messsage: `There is no account with ${email} , Please create an account and try again`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    // console.log(isPasswordMatch);

    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      name: user.name,
      email: user.email,
      role: user.role,
    });


    user.refreshToken=refreshToken
    user.refreshTokenExpiresTime= new Date(Date.now()+7*24*60*60*1000);
    user.lastlogin=new Date();
    await user.save();

    res.status(200).json({
      data: user,
      accessToken,
      refreshToken,
    });



  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
