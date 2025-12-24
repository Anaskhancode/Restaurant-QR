import express from 'express';
import { forgotPassword, Login, register, resetPassword } from '../controllers/auth.controller.js';
import SessionTokenVerfiy from '../middlewares/SessionTokenVerfiy.js';

const router= express.Router();


router.post('/register',register)
router.post('/login',Login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.post('/convert' , SessionTokenVerfiy , (req,res)=>{
    console.log(req.session)
    // const session = req.session ;
    // session.convertedSession = true ;
    // await session.save()
})

export default router