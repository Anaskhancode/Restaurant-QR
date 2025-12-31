import express from 'express' ;
import { applyCoupan, getAllCoupans, registerCoupan } from '../controllers/coupan.controller.js';
import verifyToken from '../middlewares/verifyToken.js'
import checkGuestOrUser from '../middlewares/checkGuestAndUser.js'
const router = express.Router() ;


router.get('/coupans' ,verifyToken, getAllCoupans)
router.post('/coupans' , registerCoupan)
router.post('/applyCoupan',checkGuestOrUser,applyCoupan)
export default router ;