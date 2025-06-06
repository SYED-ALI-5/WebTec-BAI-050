let express = require('express');
let router = express.Router();
let Suiting = require('../../models/suitings.model');

router.get('/admin/suiting', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/suiting");
});

router.post('/admin/suiting', async (req, res) => {
    let data = req.body;

    let suit = new Suiting();

    suit.image1 = data.image1;
    suit.image2 = data.image2;
    suit.image3 = data.image3;
    suit.image4 = data.image4;
    suit.desc1 = data.desc1;
    suit.desc2 = data.desc2;
    suit.price1 = data.price1;
    suit.price2 = data.price2;
    suit.sizes1 = data.size1;
    suit.sizes2 = data.size2;

    await suit.save();
    return res.redirect('/');
});

module.exports = router;