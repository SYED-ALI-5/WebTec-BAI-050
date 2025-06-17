const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/users.model');

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', { error: 'Incorrect password' });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        return res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
