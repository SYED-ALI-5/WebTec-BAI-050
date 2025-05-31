const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  phone: String,
  address: String,
  cod: Boolean,
  cardNumber: String,
  cvv: String,
  expiry: String,
  cartItems: Array,
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: Number
});

module.exports = mongoose.model('Order', orderSchema);