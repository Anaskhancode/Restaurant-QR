import Cart from '../models/cart.js'
import Order from '../models/order.js';
import User from '../models/user.js'


const calculateOrderNumber = () => {
  const date = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `ORDER-${date * randomNumber}`;
};


export const createOrder = async (req, res, next) => {

  const {
    tableNumber,
    customerEmail,
    customerName,
    customerPhone,
    notes,
    paymentMethod
  } = req.body;
  if (!tableNumber) {
    const error = new Error('No table Found');
    error.status = 404;
    throw error;
  }
  try {
    //---------userId-----------
    let userId;
    if (req.user) {
      userId = req.user.id;
    }
    /* ---------- Generate Order Number ---------- */
   const orderNumber = calculateOrderNumber();


    //-------------Items------------------
    const cartItems = await Cart.findOne({ userId }).populate('items.menuItemId')
    if (!cartItems || cartItems.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let orderItems = [];
    for (let item of cartItems.items) {
      let subTotal = 0;
      const total = item.menuItemId.price * item.quantity
      subTotal += total
      orderItems.push({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
        subTotal
      })
    }
    console.log(cartItems);
    //----------subTotal,discountAmount,coupancode,finalAmount---------------
    const subTotal = cartItems.totalCartPrice;
    const discountAmount = cartItems.discountAmount;
    const coupanCode = cartItems.appliedCoupan;
    const finalAmount = cartItems.finalAmount;
    //------------tableNumber,customeremail,customerName,customerPhone,Notes,paymentMethod----------
    //from ui 
    
    // res.json({
    //   orderNumber,
    //   userId,
    //   orderItems,
    //   subTotal,
    //   discountAmount,
    //   coupanCode,
    //   finalAmount,
    //   tableNumber,
    //   customerEmail,
    //   customerName,
    //   customerPhone,
    //   notes,
    //   paymentMethod
    // })
    /* ---------- Create Order ---------- */
    const order = await Order.create({
      orderNumber,
      userId,
      sessionToken: null,
      items: orderItems,
      subTotal,
      discountAmount,
      coupanCode,
      finalAmount,
      tableNumber,
      customerEmail,
      customerName,
      customerPhone,
      notes,
      paymentMethod,
    });
    /* ---------- Clear Cart After Order ---------- */
    cartItems.items = [];
    cartItems.totalCartPrice = 0;
    cartItems.discountAmount = 0;
    cartItems.appliedCoupon = null;
    cartItems.finalAmount = 0;
    await cartItems.save();
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalOrders: 1 } }
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error)
  }
};