var mongoose = require('mongoose');
var userRoleSchema = mongoose.Schema(
    {
        dateAssigned: Date,
        admin: {type: mongoose.Schema.ObjectId, ref: ('Administrators')},
        practitioner: {type: mongoose.Schema.ObjectId, ref: ('Physiotherapests')},
        client: {type: mongoose.Schema.ObjectId, ref: ('PatientProfiles')},
        role: {type: mongoose.Schema.ObjectId, ref: ('RoleCode')}
    }
);

var UserRoles = mongoose.model('userRole', userRoleSchema);
exports.Model = UserRoles;