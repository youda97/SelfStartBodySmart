var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var rehabilitationPlansSchema = mongoose.Schema({

    planName: String,
    description: String,
    physioID: {type: mongoose.Schema.ObjectId, ref: 'Physiotherapests'},
    date: Date,
    //plan: [{type: mongoose.Schema.ObjectId, ref: 'Treatments'}],
    assessmentTests: [{type: mongoose.Schema.ObjectId, ref: 'AssessmentTests'}],
    exerciseList: [{type: mongoose.Schema.ObjectId, ref: 'ExerciseList'}]

});

    rehabilitationPlansSchema.plugin(mongoosePaginate);
var RehabilitationPlansSchema = mongoose.model('rehabilitationPlan', rehabilitationPlansSchema);
exports.Model = RehabilitationPlansSchema;