import Cart from '../models/cart.js'
import Order from '../models/order.js';
import User from '../models/user.js'
import razorpay from '../config/razorpay.js';
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config();
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
    if(paymentMethod==='CASH'){
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
        paymentStatus:'pending',
        paymentMethod,
      });
       res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
    }
    if(paymentMethod==='Razorpay'){
       console.log('this is runnnnnnnnnnnnnnnning');
      const options = {
        amount: finalAmount * 100,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          customerEmail,
          customerPhone,
          customerName,
        },
      };
      const razorpayOrder = await razorpay.orders.create(options);
      console.log(razorpayOrder);
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
        paymentStatus: 'pending',
        razorPayOrderId : razorpayOrder.id
      });

      return res.json({
        order,
      razorPayOrder : {...razorpayOrder , key : process.env.RAZORPAY_API_KEY}
      });
    }
    /* ---------- Clear Cart After Order ---------- */
    cartItems.items = [];
    cartItems.totalCartPrice = 0;
    cartItems.discountAmount = 0;
    cartItems.appliedCoupan = null;
    cartItems.finalAmount = 0;
    await cartItems.save();
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalOrders: 1 } }
    );

    
  } catch (error) {
    next(error)
  }
};

//--------------------Verify Token ---------------------------
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      paymentId,
      razorPayOrderId,
      signature,
    } = req.body;

    if (!paymentId || !razorPayOrderId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data',
      });
    }

    /* ---------- Generate Signature ---------- */
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(`${razorPayOrderId}|${paymentId}`)
      .digest('hex');

    /* ---------- Compare Signatures ---------- */
    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    /* ---------- Update Order ---------- */
    const order = await Order.findOneAndUpdate(
      { razorPayOrderId },
      {
        paymentStatus: 'success',
        razorPayPaymentId: paymentId,
        razorPaySignature: signature,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    /* ---------- Clear Cart ---------- */
    if (order.userId) {
      const cart = await Cart.findOne({ userId: order.userId });
      if (cart) {
        cart.items = [];
        cart.totalCartPrice = 0;
        cart.discountAmount = 0;
        cart.appliedCoupan = null;
        cart.finalAmount = 0;
        await cart.save();
      }

      await User.findByIdAndUpdate(
        order.userId,
        { $inc: { totalOrders: 1 } }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};



/* ================= FETCH USER ORDERS ================= */
export const fetchOrdersByUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.menuItemId', 'name image price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};


/* ================= FETCH RAZORPAY ORDER INFO ================= */
export const fetchRazorpayOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'SUCCESS') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    if (!order.razorPayOrderId) {
      // Create a new Razorpay order if not exists
      const options = {
        amount: order.finalAmount * 100, // amount in paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
        },
      };

      const razorpayOrder = await razorpay.orders.create(options);

      order.razorPayOrderId = razorpayOrder.id;
      await order.save();

      return res.json({
        order,
        razorPayOrder: { ...razorpayOrder, key: process.env.RAZORPAY_API_KEY },
      });
    }

    // If Razorpay order already exists, just send it
    return res.json({
      order,
      razorPayOrder: { id: order.razorPayOrderId, key: process.env.RAZORPAY_API_KEY, amount: order.finalAmount * 100 },
    });
  } catch (error) {
    next(error);
  }
};


/* ================= ADMIN: FETCH ALL ORDERS ================= */
export const fetchAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // latest first
      .populate('items.menuItemId', 'name image price')
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};


/* ================= ADMIN: LAST 5 ORDERS ================= */
export const fetchLastFiveOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })   // newest first
      .limit(5)                 // only 5 orders
      .populate('items.menuItemId', 'name price')
      .populate('userId', 'name');

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};


/* ================= ADMIN: UPDATE ORDER STATUS ================= */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'served'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};
