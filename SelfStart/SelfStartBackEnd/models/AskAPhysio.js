var mongoose = require('mongoose');

var askAPhysioSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    comment: String,
});
var AskAPhysioSchema = mongoose.model('askAPhysio', askAPhysioSchema);
exports.Model = AskAPhysioSchema;