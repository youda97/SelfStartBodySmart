var mongoose = require('mongoose');

var answersSchema = mongoose.Schema({
    answer: String,
    question: String,
    test: {type: mongoose.Schema.ObjectId, ref: 'AssessmentTest'}
});

var AnswersSchema = mongoose.model('answer', answersSchema);
exports.Model = AnswersSchema;