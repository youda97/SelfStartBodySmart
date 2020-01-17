var mongoose = require('mongoose');

var recommendationsSchema = mongoose.Schema({
    timeStamp: {
        type: Date,
        required: true
    },
    decision: String,
    treatment: {type: mongoose.Schema.ObjectId, ref: 'Treatments'},
    test: {type: mongoose.Schema.ObjectId, ref: 'AssessmentTests'}
});
var RecommendationsSchema = mongoose.model('recommendation', recommendationsSchema);
exports.Model = RecommendationsSchema;
