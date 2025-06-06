let express = require('express');
let router = express.Router();
let Views = require('../../models/views.model');

router.get('/admin/views', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/views");
});

router.post('/admin/views', async (req, res) => {
    let data = req.body;

    let view = new Views();
    view.name = data.name;
    view.description = data.description;
    view.image = data.image;

    await view.save();
    return res.redirect('/');
});

module.exports = router;