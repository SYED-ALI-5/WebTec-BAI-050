const express = require('express');
const router = express.Router();
const Order = require('../../models/orders.model');

router.post("/placeOrder", async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.redirect("/login");
  }

  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.send("Cart is empty.");
  }

  const { phone, address, cardNumber, cvv, expiry, cod } = req.body;

  const grandTotal = cart.reduce((total, item) => total + parseFloat(item.TotalPrice), 0);

  const newOrder = new Order({
    userName: req.session.user.name,
    userEmail: req.session.user.email,
    phone,
    address,
    cod: !!cod,
    cardNumber: cod ? null : cardNumber,
    cvv: cod ? null : cvv,
    expiry: cod ? null : expiry,
    cartItems: cart,
    totalAmount: grandTotal,
    status: "Not Completed",
  });

  try {
    await newOrder.save();
    req.session.cart = [];
    res.send("Order placed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to place order.");
  }
});

router.get('/admin/orders', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'admin') {
    return res.redirect('/login');
  }

  try {
    const orders = await Order.find();
    res.render('admin/orders', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post('/admin/order/status/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;