import express from 'express' ;
import { getAllCoupans, registerCoupan } from '../controllers/coupan.controller.js';

const router = express.Router() ;


router.get('/coupans' , getAllCoupans)
router.post('/coupans' , registerCoupan)

export default router ;