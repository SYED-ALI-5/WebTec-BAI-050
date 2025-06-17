let express = require('express');
let mongoose = require("mongoose");
let session = require('express-session');
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
server.use("/", require("./controllers/user.cart.controller"));
server.use("/", require("./controllers/user.orders.controller"));
server.use("/", require("./controllers/user.suiting.controller"));
server.use("/", require("./controllers/user.footwear.controller"));
server.use("/", require("./controllers/admin/admin.views.controller"));
server.use("/", require("./controllers/admin/admin.suiting.controller"));
server.use("/", require("./controllers/admin/admin.footwear.controller"));
server.use("/", require("./controllers/admin/admin.login.controller"));
server.use("/", require("./controllers/admin/admin.order.controller"));
// server.use("/", require("./controllers/admin/admin.register.controller"));

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

server.get('/admindashboard', (req, res) => {
  if (!req.session.user || req.session.user.isAdmin === 'user') {
    return res.redirect('/login');
  }
  res.render('admin/dashboard');
});

server.get("/checkout", (req, res) => {

  if (!req.session.user || req.session.user.isAdmin !== 'user') {
    return res.redirect('/login');
  }
  else {
    const cart = req.session.cart || [];

    let grandTotal = 0;
    for (const item of cart) {
      grandTotal += parseFloat(item.TotalPrice);
    }

    res.render("checkoutform", { cart, grandTotal });
  }
});

server.get('/logout', (req, res) => {
  if (req.session.user.isAdmin === 'user') {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out');
      }
    });
    res.redirect('/login');
  }
  else {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out');
      }
    });
    res.redirect('/loginadmin');
  }
});

mongoose.connect("mongodb://localhost:27017/Eccomerce").then(() => {
  console.log("Connected to Db");
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});