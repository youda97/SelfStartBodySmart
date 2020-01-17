var mongoose = require('mongoose');

var RehabClientLink = mongoose.Schema({

    RehabilitationPlan: {type: mongoose.Schema.ObjectId, ref: 'RehabilitationPlans'},
    Patient: {type: mongoose.Schema.ObjectId, ref: 'PatientProfiles'},
    terminated : Boolean,
    assessmentTest: {type: mongoose.Schema.ObjectId, ref: 'AssessmentTests'}

});
var RehabClientLinkSchema = mongoose.model('rehabClientLinks', RehabClientLink);
const RehabClientLinker = exports.Model = RehabClientLinkSchema;

// //Adding Functionalities to the model
// //-----------------Get Rehab plan link by patient and plan-------------------------------//
// exports.getLinkByPatientAndPlan = function(clientRehabLink, callback){
//     console.log(client)
//     console.log(rehab)
//
//     // RehabClientLinker.find({RehabilitationPlan: rehab}, (err, link))
//     RehabClientLinker.find({Patient: clientRehabLink.Patient}, function (err, links) {
//         console.log(links);
//         if(links) {
//             console.log(links);
//             links.findOne({rehabPlans: rehab}, callback);
//         } else {
//             clientRehabLink.save();
//         }
//     });
// };
// //-----------------Get Rehab plan link by patient and plan-------------------------------//
// exports.addLinkByPatientAndPlan = function(rCL, callback){
//     console.log(client)
//     console.log(rehab)
//     // RehabClientLinker.find({Patient: client, RehabilitationPlan: rehab}, callback);
//     rCL.save(callback);
// };
