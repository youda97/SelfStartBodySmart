var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var exercisesSchema = mongoose.Schema({
    name: String,
    description: String,
    authorName: String,
    actionSteps: [String],
    sets: Number,
    reps: Number,
    duration: String,
    multimediaURL: String,
    images: [{type: mongoose.Schema.ObjectId, ref: 'Images'}],
    exerciseList: [{type: mongoose.Schema.ObjectId, ref: 'ExerciseList'}],
});

exercisesSchema.plugin(mongoosePaginate);
var ExercisesSchema = mongoose.model('exercise', exercisesSchema);
exports.Model = ExercisesSchema;