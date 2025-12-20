import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import transporter from "../services/emailService.js";
import registerTemplate from "../services/templates/registerTemplate.js";
import ForgetPassTemplate from "../services/templates/ForgetPassTemplate.js";
import crypto from 'crypto'


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


    //email sent 
    const info = await transporter.sendMail({
    from: 'anaskhanofficial005@gmail.com',
    to: newUser.email,
    subject: 'User registration',
    text: registerTemplate(newUser.name , "ElegentBites") // plain‑text body
     
   })
   console.log('mail sent', info.messageId)


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

    if (!isPasswordMatch) {
      return res.status(400).json({messsage:'Password do not match, Please try again'})
    }

    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
    });
    const refreshToken = generateRefreshToken({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
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


//------------------FORGET PASSWORD---------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // create reset token (RAW)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // store HASHED token in DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    // send email
    const info = await transporter.sendMail({
      from: "anaskhanofficial005@gmail.com",
      to: user.email,
      subject: "Reset Your Password",
      html: ForgetPassTemplate(user.name, "ElegantBites", resetToken),
    });

    console.log("Mail sent:", info.messageId);

    res.status(200).json({
      success: true,
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//-----------------------Reset Password-----------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(password, 12);
    user.passwordHash = newHashedPassword;

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
