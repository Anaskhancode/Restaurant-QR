import express from 'express';
import { createOrder, fetchOrdersByUser, fetchRazorpayOrder, verifyRazorpayPayment } from '../controllers/order.controller.js';
import checkGuestOrUser from '../middlewares/checkGuestAndUser.js';
const router = express.Router();

router.post('/orders', checkGuestOrUser, createOrder);
router.post('/verify/payment', verifyRazorpayPayment);
router.get('/my-orders', checkGuestOrUser, fetchOrdersByUser);
router.post('/orders/:orderId/razorpay', checkGuestOrUser, fetchRazorpayOrder);

export default router;