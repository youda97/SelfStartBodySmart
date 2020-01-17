var mongoose = require('mongoose');

var gendersSchema = mongoose.Schema({

    name: String
});
var GendersSchema = mongoose.model('gender', gendersSchema);
exports.Model = GendersSchema;