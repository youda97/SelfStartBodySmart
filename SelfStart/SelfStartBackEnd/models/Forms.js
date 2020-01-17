var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var formsSchema = mongoose.Schema({
    name: String,
    description: String,
    author: {type: mongoose.Schema.ObjectId, ref: 'Administrators'},
   // questions: [{type: mongoose.Schema.ObjectId, ref: 'Questions'}],
    assessmentTest: [{type: mongoose.Schema.ObjectId, ref: 'AssessmentTests'}],
    //answer: [{type: mongoose.Schema.ObjectId, ref: 'Answers'}],

    questionOrder: [{type: mongoose.Schema.ObjectId, ref: 'QuestionOrder'}]
});

formsSchema.plugin(mongoosePaginate);
var Forms = mongoose.model('form', formsSchema);
exports.Model = Forms;
