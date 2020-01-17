var mongoose = require('mongoose');
var loginsSchema = mongoose.Schema(
    {
        email: String,
        password: String,
        nonce: String,
        response: String,
        token: String,
        requestType: String,
        wrongUserName: Boolean,
        wrongPassword: Boolean,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        loginFailed: Boolean,
        sessionIsActive: Boolean
        // accType: Number
    }
);

var Logins = mongoose.model('login', loginsSchema);
exports.Model = Logins;