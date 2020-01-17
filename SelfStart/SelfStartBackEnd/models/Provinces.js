var mongoose = require('mongoose');

var provincesSchema = mongoose.Schema({
    name: String,
    country: {type: mongoose.Schema.ObjectId, ref: "Counties"},
    cities: [{type: mongoose.Schema.ObjectId, ref: "Cities"}],
});

var ProvincesSchema = mongoose.model('province', provincesSchema);
exports.Model = ProvincesSchema;