import mongoose from 'mongoose';
 
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
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
  notes: {
    type: String,
  },
});
 
const Order = mongoose.model('Order', orderSchema);
 
export default Order;
 
 