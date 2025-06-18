let express = require('express');
let router = express.Router();
let Footwear = require('../models/footwears.model');

router.get('/specificFootwear/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const footwear = await Footwear.findById(id);
    const sizesArray = footwear.sizes.split(" ");

    if (!footwear) return res.status(404).send('Footwear not found');

    const data = {
      id: footwear._id,
      image: footwear.image1,
      hoverImage: footwear.image2,
      desc: footwear.desc,
      price: footwear.price,
      sizes: sizesArray
    };


    res.render('specificFootwear', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/api/footwear/:id', async (req, res) => {
  try {
    const footwear = await Footwear.findById(req.params.id);
    if (!footwear) return res.status(404).json({ error: 'Footwear not found' });
    res.json(footwear);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;