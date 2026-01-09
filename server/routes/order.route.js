import express from 'express';
import { createOrder, fetchAllOrders, fetchLastFiveOrders, fetchOrdersByUser, fetchRazorpayOrder, updateOrderStatus, verifyRazorpayPayment } from '../controllers/order.controller.js';
import checkGuestOrUser from '../middlewares/checkGuestAndUser.js';
import checkRole from '../middlewares/checkRole.js'
import verifyToken from '../middlewares/verifyToken.js';
const router = express.Router();

router.post('/orders', checkGuestOrUser, createOrder);
router.post('/verify/payment', verifyRazorpayPayment);
router.get('/my-orders', checkGuestOrUser, fetchOrdersByUser);
router.post('/orders/:orderId/razorpay', checkGuestOrUser, fetchRazorpayOrder);
router.get('/admin/orders', verifyToken,checkRole(['admin']), fetchAllOrders);
router.get('/admin/orders/recent', verifyToken,checkRole(['admin']), fetchLastFiveOrders);
router.patch('/admin/orders/:orderId/status', verifyToken,checkRole(['admin']), updateOrderStatus);


export default router;