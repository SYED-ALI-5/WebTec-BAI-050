const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  orderId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);