var mongoose = require('mongoose');

var exerciseListSchema = mongoose.Schema({
    order: Number,
    exercise: {type: mongoose.Schema.ObjectId, ref: 'Exercise'},
    rehabilitationPlan: {type: mongoose.Schema.ObjectId, ref: 'RehabilitationPlans'},
});

var ExerciseListSchema = mongoose.model('exerciseList', exerciseListSchema);
exports.Model = ExerciseListSchema;