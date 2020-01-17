var mongoose = require('mongoose');

var citiesSchema = mongoose.Schema({
    name: String,
});
var CitiesSchema = mongoose.model('city', citiesSchema);
exports.Model = CitiesSchema;