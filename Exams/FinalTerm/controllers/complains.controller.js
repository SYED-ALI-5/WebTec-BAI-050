const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Complaint = require('../models/complains.model');
const Order = require('../models/orders.model');

router.get('/contact', (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.redirect('/login');
  }
  res.render('contact');
});

router.post('/contact', async (req, res) => {
  const { orderId, message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.send('Invalid Order ID format');
  }

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    return res.send('Invalid Order ID. No such order exists.');
  }

  try {

    await Complaint.create({
      userName: req.session.user.name,
      userEmail: req.session.user.email,
      orderId,
      message
    });

    res.redirect('/my-complaints');
  } catch (err) {
    console.error(err);
    res.send('Error submitting complaint');
  }
});

router.get('/my-complaints', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.redirect('/login');
  }
  const complaints = await Complaint.find({ userEmail: req.session.user.email });
  res.render('complains', { complaints });
});

router.get('/admin/complaints', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'admin') {
    return res.redirect('/loginadmin');
  }

  const complaints = await Complaint.find().populate('userEmail');
  res.render('admin/user_complains', { complaints });
});

module.exports = router;