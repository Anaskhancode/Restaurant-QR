import express from 'express' ;
import { getAllCoupans, registerCoupan } from '../controllers/coupan.controller.js';
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router() ;


router.get('/coupans' ,verifyToken, getAllCoupans)
router.post('/coupans' , registerCoupan)

export default router ;