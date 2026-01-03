import mongoose from 'mongoose';
 
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionToken: {
    type: String,
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
  },
  discountAmount: {
    type: Number,
  },
  coupanCode: {
    type: String,
  },
  finalAmount: {
    type: Number,
  },
  tableNumber: {
    type: Number,
  },
  customerEmail: {
    type: String,
  },
  customerName: {
    type: String,
  },
  customerPhone : {
    type : Number
  },
  notes: {
    type: String,
  },
  paymentMethod: {
      type: String,
      enum: ['CASH', 'Razorpay'],
    },
});
 
const Order = mongoose.model('Order', orderSchema);
 
export default Order;
 
 