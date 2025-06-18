let express = require('express');
let router = express.Router();
let Views = require('../../models/views.model');
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

router.get('/admin/views', (req, res) => {
    if (!req.session.user || req.session.user.isAdmin === 'user') {
        return res.redirect('/login');
    }
    return res.render("admin/views");
});

router.post('/admin/views', upload.single('image'), async (req, res) => {
    let view = new Views();
    view.name = req.body.name;
    view.description = req.body.description;
    view.image = '/images/Assets/' + req.file.filename;

    await view.save();
    return res.redirect('/admindashboard');
});

router.get('/admin/views/edit/:id', async (req, res) => {
    const view = await Views.findById(req.params.id);
    if (!view) return res.redirect('/admin/listingViews');
    return res.render("admin/editView", { view });
});

router.post('/admin/views/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = { name, description };

        if (req.file) {
            updateData.image = '/images/Assets/' + req.file.filename;
        }

        await Views.findByIdAndUpdate(req.params.id, updateData);
        return res.redirect('/admin/listingViews');
    } catch (err) {
        console.error('Error updating view:', err);
        return res.status(500).send('Server Error');
    }
});

router.post('/admin/views/delete/:id', async (req, res) => {
  await Views.findByIdAndDelete(req.params.id);
  res.redirect('/admin/listingViews');
});

router.get('/admin/listingViews', async (req, res) => {
  if (!req.session.user || req.session.user.isAdmin !== 'admin') {
    return res.redirect('/login');
  }

  try {
    const views = await Views.find();
    res.render('admin/listingViews', { views });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;