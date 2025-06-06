let mongoose = require('mongoose');

let footwearSchema = new mongoose.Schema({
  image1: String,
  image2: String,
  desc: String,
  price: String,
  sizes: String,
});

let footwearModel = mongoose.model('Footwear', footwearSchema);
module.exports = footwearModel;