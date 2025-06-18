const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');

router.get('/orders', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.redirect('/login');
  }

  try {
    const orders = await Order.find({ userEmail: req.session.user.email }).sort({ orderDate: -1 });
    res.render('orders', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;