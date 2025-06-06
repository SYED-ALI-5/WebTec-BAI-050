let express = require('express');
let router = express.Router();
let Footwear = require('../../models/footwears.model');

router.get('/admin/footwear', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/footwear");
});

router.post('/admin/footwear', async (req, res) => {
    let data = req.body;

    let footwear = new Footwear();

    footwear.image1 = data.image1;
    footwear.image2 = data.image2;
    footwear.desc = data.desc;
    footwear.price = data.price;
    footwear.sizes = data.size;

    await footwear.save();
    return res.redirect('/');
});

module.exports = router;