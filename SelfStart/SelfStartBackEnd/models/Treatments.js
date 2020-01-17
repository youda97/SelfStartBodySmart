var mongoose = require('mongoose');

var treatmentsSchema = mongoose.Schema({
    dateAssign: {
        type: Date,
        required: true
    },
    response: [{type: mongoose.Schema.ObjectId, ref: 'Recommendations'}],
    rehabilitationPlan: {type: mongoose.Schema.ObjectId, ref: 'RehabilitationPlans'},
    physio: {type: mongoose.Schema.ObjectId, ref: 'Physiotherapests'}

});
var TreatmentsSchema = mongoose.model('treatmnet', treatmentsSchema);
exports.Model = TreatmentsSchema;
