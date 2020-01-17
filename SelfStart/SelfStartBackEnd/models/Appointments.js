var mongoose = require('mongoose');

var appointmentsSchema = mongoose.Schema({
    date: Date,
    endDate: Date,
    reason: String,
    other: String,
    pName: String,
    order: String,
    patient: {type: mongoose.Schema.ObjectId, ref: 'Patients'}
});
var AppointmentsSchema = mongoose.model('appointment', appointmentsSchema);
exports.Model = AppointmentsSchema;