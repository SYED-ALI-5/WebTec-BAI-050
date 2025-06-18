const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Admin = require('../../models/admin.model');

router.get('/loginadmin', (req, res) => {
    res.render('admin/loginadmin', { error: null });
});

router.post('/loginadmin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.render('admin/loginadmin', { error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.render('admin/loginadmin', { error: 'Incorrect password' });
        }

        req.session.user = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            isAdmin: admin.isAdmin
        };
        return res.redirect('/admindashboard');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
