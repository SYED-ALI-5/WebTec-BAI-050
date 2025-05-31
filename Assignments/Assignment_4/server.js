let express = require('express');
let mongoose = require("mongoose");
let session = require('express-session');
const Suiting = require('./models/suitings.model');
const Footwear = require('./models/footwears.model');
const Order = require('./models/orders.model');
let expressLayouts = require('express-ejs-layouts');
let server = express();

server.use(session({
  secret: 'SecretKey123', // Change to env var in production
  resave: false,
  saveUninitialized: false
}));

server.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

server.set("view engine", "ejs");
server.use(expressLayouts)
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/", require("./controllers/user.register.controller"));
server.use("/", require("./controllers/user.login.controller"));

server.get("/", async (req, res) => {
  let View = require("./models/views.model");
  let views = await View.find();
  let Suiting = require("./models/suitings.model");
  let suitings = await Suiting.find();
  let Footwear = require("./models/footwears.model");
  let footwear = await Footwear.find();
  res.render("index", { views, suitings, footwear });
});

server.get("/cv", (req, res) => {
  res.render("cv");
});

server.get("/accounts", (req, res) => {
  res.render("accounts");
});

server.get('/login', (req, res) => {
  res.render('login');
});

server.get('/register', (req, res) => {
  res.render('register');
});

server.get('/specificSuiting/:id', async (req, res) => {
  try {
    const item = req.query.item;
    const id = req.params.id;

    const suiting = await Suiting.findById(id);
    const sizesArray1 = suiting.sizes1.split(" ");
    const sizesArray2 = suiting.sizes2.split(" ");

    if (!suiting) return res.status(404).send('Suiting not found');

    const data = {
      id: suiting._id,
      image: item === '1' ? suiting.image1 : suiting.image3,
      hoverImage: item === '1' ? suiting.image2 : suiting.image4,
      desc: item === '1' ? suiting.desc1 : suiting.desc2,
      price: item === '1' ? suiting.price1 : suiting.price2,
      sizes: item === '1' ? sizesArray1 : sizesArray2
    };

    res.render('specificSuiting', { data, item });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

server.get('/specificFootwear/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const footwear = await Footwear.findById(id);
    const sizesArray = footwear.sizes.split(" ");

    if (!footwear) return res.status(404).send('Footwear not found');

    const data = {
      id: footwear._id,
      image: footwear.image1,
      hoverImage: footwear.image2,
      desc: footwear.desc,
      price: footwear.price,
      sizes: sizesArray
    };


    res.render('specificFootwear', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

server.post('/addToCart', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ redirect: '/login' });
  }

  const { data, size, quantity, TotalPrice } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push({ data, size, quantity, TotalPrice });

  res.json({ message: 'Item added to cart successfully!' });
});

server.get("/checkout", (req, res) => {
  const cart = req.session.cart || [];

  // Calculate grand total
  let grandTotal = 0;
  for (const item of cart) {
    grandTotal += parseFloat(item.TotalPrice);
  }

  res.render("checkoutform", { cart, grandTotal });
});

server.post('/removeFromCart', (req, res) => {
  const index = parseInt(req.body.index);

  if (!isNaN(index) && req.session.cart && index >= 0 && index < req.session.cart.length) {
    req.session.cart.splice(index, 1); // Remove the item
  }

  res.redirect('/checkout'); // Refresh the cart page
});

// API route to get specific suiting item as JSON
server.get('/api/suiting/:id', async (req, res) => {
  try {
    const suiting = await Suiting.findById(req.params.id);
    if (!suiting) return res.status(404).json({ error: 'Suiting not found' });
    res.json(suiting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// API route to get specific footwear item as JSON
server.get('/api/footwear/:id', async (req, res) => {
  try {
    const footwear = await Footwear.findById(req.params.id);
    if (!footwear) return res.status(404).json({ error: 'Footwear not found' });
    res.json(footwear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

server.post("/placeOrder", async (req, res) => {
  if (!req.session.user) {
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
    totalAmount: grandTotal
  });

  try {
    await newOrder.save();
    req.session.cart = []; // Clear cart
    res.send("Order placed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to place order.");
  }
});

server.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/login');
  });
});

mongoose.connect("mongodb://localhost:27017/Eccomerce").then(() => {
  console.log("Connected to Db");
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});