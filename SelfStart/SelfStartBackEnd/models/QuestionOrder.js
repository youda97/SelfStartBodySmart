var mongoose = require('mongoose');

var questionOrderSchema = mongoose.Schema({
    order: Number,
    question: {type: mongoose.Schema.ObjectId, ref: 'Questions'},
    form: {type: mongoose.Schema.ObjectId, ref: 'Forms'}
});

var QuestionOrderSchema = mongoose.model('questionOrder', questionOrderSchema);
exports.Model = QuestionOrderSchema;