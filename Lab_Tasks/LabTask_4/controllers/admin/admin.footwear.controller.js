let express = require('express');
let router = express.Router();
let Footwear = require('../../models/footwears.model');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/Assets');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.get('/admin/footwear', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/footwear");
});

router.post('/admin/footwear', upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
    let data = req.body;

    let footwear = new Footwear();

    footwear.image1 = '/images/Assets/' + req.files['image1'][0].filename;
    footwear.image2 = '/images/Assets/' + req.files['image2'][0].filename;
    footwear.desc = data.desc;
    footwear.price = data.price;
    footwear.sizes = data.size;

    await footwear.save();
    return res.redirect('/admindashboard');
});

router.get('/admin/footwear/edit/:id', async (req, res) => {
    const footwear = await Footwear.findById(req.params.id);
    if (!footwear) return res.redirect('/admin/listingFootwear');
    res.render('admin/editFootwear', { footwear });
});

router.post('/admin/footwear/edit/:id', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;

        let updateData = {
            desc: data.desc,
            price: data.price,
            sizes: data.sizes
        };

        if (files.image1) updateData.image1 = '/images/Assets/' + files.image1[0].filename;
        if (files.image2) updateData.image2 = '/images/Assets/' + files.image2[0].filename;

        await Footwear.findByIdAndUpdate(req.params.id, updateData);

        res.redirect('/admin/listingFootwear');
    } catch (err) {
        console.error("Error updating footwear:", err);
        res.status(500).send("Server Error");
    }
});

router.post('/admin/footwear/delete/:id', async (req, res) => {
    await Footwear.findByIdAndDelete(req.params.id);
    res.redirect('/admin/listingFootwear');
});

router.get('/admin/listingFootwear', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'admin') {
    return res.redirect('/login');
  }

  try {
    const footwear = await Footwear.find();
    res.render('admin/listingFootwear', { footwear });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;