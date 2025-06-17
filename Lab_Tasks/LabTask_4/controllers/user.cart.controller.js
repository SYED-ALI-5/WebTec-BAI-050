const express = require('express');
const router = express.Router();

router.post('/addToCart', (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.status(401).json({ redirect: '/login' });
  }

  const { data, size, quantity, TotalPrice } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push({ data, size, quantity, TotalPrice });

  res.json({ message: 'Item added to cart successfully!' });
});

router.post('/removeFromCart', (req, res) => {
  const index = parseInt(req.body.index);

  if (!isNaN(index) && req.session.cart && index >= 0 && index < req.session.cart.length) {
    req.session.cart.splice(index, 1);
  }

  res.redirect('/checkout');
});

module.exports = router;