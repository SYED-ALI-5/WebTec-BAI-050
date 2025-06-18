const express = require('express');
const router = express.Router();
const Suiting = require('../../models/suitings.model');
const multer = require('multer');

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

router.get('/admin/suiting', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/suiting");
});

router.post('/admin/suiting', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files;
        const data = req.body;

        const suit = new Suiting({
            image1: '/images/Assets/' + files.image1[0].filename,
            image2: '/images/Assets/' + files.image2[0].filename,
            image3: '/images/Assets/' + files.image3[0].filename,
            image4: '/images/Assets/' + files.image4[0].filename,
            desc1: data.desc1,
            desc2: data.desc2,
            price1: data.price1,
            price2: data.price2,
            sizes1: data.sizes1,
            sizes2: data.sizes2
        });

        await suit.save();
        return res.redirect('/admindashboard');
    } catch (err) {
        console.error("Error saving suiting:", err);
        return res.status(500).send("Server Error");
    }
});

router.get('/admin/suiting/edit/:id', async (req, res) => {
  const suiting = await Suiting.findById(req.params.id);
  if (!suiting) return res.redirect('/admin/listingSuiting');
  return res.render("admin/editSuiting", { suiting });
});

router.post('/admin/suiting/edit/:id', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;

        let updateData = {
            desc1: data.desc1,
            desc2: data.desc2,
            price1: data.price1,
            price2: data.price2,
            sizes1: data.sizes1,
            sizes2: data.sizes2
        };

        if (files.image1) updateData.image1 = '/images/Assets/' + files.image1[0].filename;
        if (files.image2) updateData.image2 = '/images/Assets/' + files.image2[0].filename;
        if (files.image3) updateData.image3 = '/images/Assets/' + files.image3[0].filename;
        if (files.image4) updateData.image4 = '/images/Assets/' + files.image4[0].filename;

        await Suiting.findByIdAndUpdate(req.params.id, updateData);

        res.redirect('/admin/listingSuiting');
    } catch (err) {
        console.error("Error updating suiting:", err);
        return res.status(500).send("Server Error");
    }
});

router.post('/admin/suiting/delete/:id', async (req, res) => {
  await Suiting.findByIdAndDelete(req.params.id);
  res.redirect('/admin/listingSuiting');
});

router.get('/admin/listingSuiting', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'admin') {
    return res.redirect('/login');
  }

  try {
    const suiting = await Suiting.find();
    res.render('admin/listingSuiting', { suiting });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
