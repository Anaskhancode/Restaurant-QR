import express from 'express' ;
import { createMenu } from '../controllers/menu.controller.js';
// import verifyToken from '../middlewares/verifyToken';

import upload from '../middlewares/upload.js';
const router = express.Router() ;

router.post('/menu' , upload.single('image') , createMenu)

export default router