import express from 'express' ;
import { createMenu, getAllMenuItems } from '../controllers/menu.controller.js';
// import verifyToken from '../middlewares/verifyToken';

import upload from '../middlewares/upload.js';
const router = express.Router() ;

router.get('/menu', getAllMenuItems);
router.post('/menu' , upload.single('image') , createMenu)

export default router