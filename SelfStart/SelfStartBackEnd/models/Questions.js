var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var questionsSchema = mongoose.Schema({
    questionText: String,
    helpDescription: String,
    optionNumber: Number,
    optionString: String,
    type: String,
    mc: Boolean,
    sa: Boolean,
    tf: Boolean,
    ra: Boolean,
    //answer: [{type: mongoose.Schema.ObjectId, ref: 'Answers'}],

    questionOrder: [{type: mongoose.Schema.ObjectId, ref: 'QuestionOrder'}]
});

questionsSchema.plugin(mongoosePaginate);
var Questions = mongoose.model('question', questionsSchema);
exports.Model = Questions;