let express = require('express');
let router = express.Router();
const Suiting = require('../models/suitings.model');

router.get('/specificSuiting/:id', async (req, res) => {
  try {
    const item = req.query.item;
    const id = req.params.id;

    const suiting = await Suiting.findById(id);
    const sizesArray1 = suiting.sizes1.split(" ");
    const sizesArray2 = suiting.sizes2.split(" ");

    if (!suiting) return res.status(404).send('Suiting not found');

    const data = {
      id: suiting._id,
      image: item === '1' ? suiting.image1 : suiting.image3,
      hoverImage: item === '1' ? suiting.image2 : suiting.image4,
      desc: item === '1' ? suiting.desc1 : suiting.desc2,
      price: item === '1' ? suiting.price1 : suiting.price2,
      sizes: item === '1' ? sizesArray1 : sizesArray2
    };

    res.render('specificSuiting', { data, item });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/api/suiting/:id', async (req, res) => {
  try {
    const suiting = await Suiting.findById(req.params.id);
    if (!suiting) return res.status(404).json({ error: 'Suiting not found' });
    res.json(suiting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;