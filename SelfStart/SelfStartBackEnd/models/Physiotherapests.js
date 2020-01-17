var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//var bcrypt=require('bcrypt');

'use strict';
const nodemailer = require('nodemailer');

var physiotherapestsSchema = mongoose.Schema({
    ID: String,
    familyName: String,
    givenName: String,
    email: String,
    encryptedPassword: {type: mongoose.Schema.ObjectId, ref: 'Passwords'},
    gender: String,
    phoneNumber: String,
    dateHired: Date,
    dateFired: Date,
    success: {
        type: Boolean,
        default: true
    },
    updatingValue: {
        type: Boolean,
        default: false
    },
    treatment: [{type: mongoose.Schema.ObjectId, ref: 'Treatments'}],
    appointments: [{type: mongoose.Schema.ObjectId, ref: 'Appointments'}],

    account: {
        //New----------------------------------------
        nonce: String,
        response: String,
        token: String,
        requestType: String,
        wrongUserName: Boolean,
        wrongPassword: Boolean,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        loginFailed: Boolean,
        sessionIsActive: Boolean,
        //-------------------------------------------
        accType: {
            type: String,
            default: "1"
        }
    }

});

physiotherapestsSchema.plugin(mongoosePaginate);
var PhysiotherapestsSchema = mongoose.model('physiotherapest', physiotherapestsSchema);
const Physio = exports.Model = PhysiotherapestsSchema;


//Adding Functionalities to Model

//----------------------------Get User By ID-----------------------------------//
exports.getUserByID = function(id, callback) {
    const query = {id: id};
    Physio.findById(id, callback);
};
//----------------------------Get User By Email--------------------------------//
exports.getUserByEmail = function(email, callback) {
    const query = {email: email};
    Physio.findOne(query, callback);
};
//-----------------------Get User By Email Direct Return-----------------------//
exports.getUserByEmailDirect = function(email) {
    const query = {email: email};
    Physio.findOne(query, (err, physio) =>{
        return physio;
    });
};
//----------------------------Add New Physiotherapest--------------------------//
exports.addPhysio = function(physio, callback) {

    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(physio.account.encryptedPassword, salt, (err, hash) =>{
            if(err){
                throw err;
            }
            physio.account.encryptedPassword = hash;
            physio.account.salt = salt;
            console.log("THIS IS THE CLIENT", physio);
            physio.save(callback);
        });
    });
};
//--------------------Comparing Password For Authentication-------------------//
exports.comparePassword = function(candidatePass, hash, callback) {
    bcrypt.compare(candidatePass, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};
//-------------------------------------------Mail Config-------------------------------------//
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'mustafadawoud97@gmail.com',
        clientId: '3636127499-6mon9v4uufa98pj0fpk4748v8nc32i6d.apps.googleusercontent.com',
        clientSecret: 'RPm9zcqr264TDQZ2qp4Iqvef',
        refreshToken: '1/Q8sZLXRxnBA6L4LNQB8COzgivKlcjS54xfR4GE5Re5GVv2RsvZqKDbmO-10mmdYX'
    }
});
//--------------------------------Send Mail For Validation------------------------------------//
exports.sendEmail = function(client){
    if(client.skype) {
        var emailBody = '<p>Hey, Marcotte here<p> <br>' 
            + '<p>This user just booked an appointment with you: ' + client.givenName + ' ' + client.familyName
            + '<br> ,p> Their skype ID is: ' + client.skype + '</p>'
    } else {
        var emailBody = '<p>Hey, Marcotte here<p> <br>' 
            + '<p>This user just booked an appointment with you: ' + client.givenName + ' ' + client.familyName
            + '<br> ,p> This user does not have a skype account connected their account, please contact them ' +
            'at their email at ' + client.email + ' to confirm a comminucation method or to ask them to setup their skype account.</p>'
    }
    // <a href="' + verificationUrl + '" target="_blank"> Click me</a></p>';
    console.log(client.email);
    var mailOptions = {
        from: 'Stephanie <user@domain.com>',
        to: client.email,
        subject: 'Marcotte Physiotherapy Email Verification',
        html: emailBody
    }

    transport.sendMail(mailOptions, (err, res) => {
        if(err){
            console.log(err); return false;
        } else {
            console.log("Email sent"); return true;
        }
    });
}
//-------------------------------------------------------------------------------------