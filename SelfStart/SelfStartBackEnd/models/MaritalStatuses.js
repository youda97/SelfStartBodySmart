var mongoose = require('mongoose');

var maritalStatusSchema = mongoose.Schema({

    name: String
});
var MaritalStatusSchema = mongoose.model('maritalStatus', maritalStatusSchema);
exports.Model = MaritalStatusSchema;