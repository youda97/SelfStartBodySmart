var mongoose = require('mongoose');

var assessmentTestSchema = mongoose.Schema({
    name: String,
    description: String,
    authorName: {type: mongoose.Schema.ObjectId, ref: 'Physiotherapests'},
    form: {type: mongoose.Schema.ObjectId, ref: 'Forms'},
    rehabPlan: {type: mongoose.Schema.ObjectId, ref: 'RehabilitationPlans'},
    patient: {type: mongoose.Schema.ObjectId, ref: 'PatientProfiles'},
    answer:[{type: mongoose.Schema.ObjectId, ref: 'Answers'}],
});
var AssessmentTestSchema = mongoose.model('assessmentTest', assessmentTestSchema);
exports.Model = AssessmentTestSchema;