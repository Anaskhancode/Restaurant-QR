import Cart from '../models/cart.js';
import Menu from '../models/menu.js';

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, userId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalCartPrice: 0 });
    }

    const menu = await Menu.findById(menuItemId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    await calculateTotal(cart);
    await cart.save();

    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= REMOVE ITEM ================= */
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await calculateTotal(cart);
    await cart.save();

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= INCREASE QUANTITY ================= */
export const increaseQuantity = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity += 1;

    await calculateTotal(cart);
    await cart.save();

    res.json({ message: 'Quantity increased', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DECREASE QUANTITY ================= */
export const decreaseQuantity = async (req, res) => {
  try {
    const { userId, menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.menuItemId.toString() !== menuItemId);
    }

    await calculateTotal(cart);
    await cart.save();

    res.json({ message: 'Quantity decreased', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CLEAR CART ================= */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.totalCartPrice = 0;
    cart.appliedCoupan = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET CART BY USER ================= */
export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate('items.menuItemId');

    if (!cart) {
      return res.status(200).json({ 
        items: [],
        totalCartPrice: 0 ,
        appliedCoupan: null,
        discountAmount: 0,
        finalAmount: 0
      });
    }


    // Map items to include menuItem key
    const mappedCart = {
      items: cart.items.map((item) => ({
        menuItem: item.menuItemId,
        quantity: item.quantity,
      })),
      totalCartPrice: cart.totalCartPrice,
      appliedCoupan: cart.appliedCoupan,
      discountAmount: cart.discountAmount,
      finalAmount: cart.finalAmount,
    };

    res.status(200).json(mappedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= HELPER FUNCTION ================= */
const calculateTotal = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const menu = await Menu.findById(item.menuItemId);
    if (menu) {
      total += menu.price * item.quantity;
    }
  }
  cart.totalCartPrice = total;
  // ✅ Revalidate applied coupon
  if (cart.appliedCoupan) {
    if (cart.totalCartPrice < cart.minOrderAmountForCoupan) {
      // Remove coupon if cart total is below min amount
      cart.appliedCoupan = null;
      cart.discountAmount = 0;
      cart.finalAmount = total;
    } else {
      // Keep coupon applied
      cart.finalAmount = total - cart.discountAmount;
    }
  } else {
    // No coupon applied
    cart.finalAmount = total;
  }
};
