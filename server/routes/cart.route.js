import express from 'express';
import {
  addToCart,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartByUser,
} from '../controllers/cart.controller.js';

const router = express.Router();

// 🛒 Cart actions
router.post('/addtocart', addToCart);
router.post('/remove', removeItemFromCart);
router.post('/increase', increaseQuantity);
router.post('/decrease', decreaseQuantity);
router.post('/clear', clearCart);

// 📦 Get cart by userId
router.get('/:userId', getCartByUser);

export default router;
