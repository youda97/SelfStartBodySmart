var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var countriesSchema = mongoose.Schema({
    name: String,
    provinces: [{type: mongoose.Schema.ObjectId, ref: "Provinces"}]
});

countriesSchema.plugin(mongoosePaginate);
var CountriesSchema = mongoose.model('country', countriesSchema);
exports.Model = CountriesSchema;