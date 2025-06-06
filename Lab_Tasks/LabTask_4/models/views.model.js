let mongoose = require('mongoose');

let viewSchema = new mongoose.Schema({
    image: String,
    name: String,
    description: String,
});

let viewModel = mongoose.model('Views', viewSchema);
module.exports = viewModel;