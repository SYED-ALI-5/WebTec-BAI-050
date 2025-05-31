let mongoose = require('mongoose');

let suitSchema = new mongoose.Schema({
  image1: String,
  image2: String,
  desc1: String,
  price1: String,
  sizes1: String,
  image3: String,
  image4: String,
  desc2: String,
  price2: String,
  sizes2: String
});

let suitModel = mongoose.model('Suitings', suitSchema);
module.exports = suitModel;