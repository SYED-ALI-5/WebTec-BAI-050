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
server.use(express.urlencoded());

server.use("/", require("./controllers/user.register.controller"));
server.use("/", require("./controllers/user.login.controller"));

server.get("/", async (req, res) =>{
    let View = require("./models/views.model");
    let views = await View.find();
    let Suiting = require("./models/suitings.model");
    let suitings = await Suiting.find();
    let Footwear = require("./models/footwears.model");
    let footwear = await Footwear.find();
    res.render("index", {views, suitings, footwear});
});

server.get("/checkout", (req, res) =>{
    res.render("checkoutform");
});

server.get("/cv", (req, res) =>{
    res.render("cv");
});

server.get("/accounts", (req, res) =>{
    res.render("accounts");
});

server.get('/login', (req, res) => {
  res.render('login');
});

server.get('/register', (req, res) => {
  res.render('register');
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