let express = require('express');
let router = express.Router();
let UserRegister = require('../models/users.model');

router.get('/register', (req, res) => {
    return res.render("register");
});

router.post('/register', async (req, res) => {
    let data = req.body;

    let register = new UserRegister();

    register.name = data.name;
    register.email = data.email;
    register.password = data.password;
    register.isAdmin = "user"

    await register.save();
    return res.redirect('/login');
});

module.exports = router;