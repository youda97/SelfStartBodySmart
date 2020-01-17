var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//var bcrypt=require('bcrypt');
const crypto = require('crypto');
var rand = require('csprng');

'use strict';
const nodemailer = require('nodemailer');

var patientProfilesSchema = mongoose.Schema(
    {
        ID: String,
        familyName: String,
        givenName: String,
        email: String,
        encryptedPassword: {type: mongoose.Schema.ObjectId, ref: 'Passwords'},
        images: [{type: mongoose.Schema.ObjectId, ref: 'Images'}],
        dateOfBirth: Date,
        phoneNumber: String,
        gender: String,
        country: String,
        province: String,
        city: String,
        apartment: Number,
        streetNumber: Number,
        packages: [{
            order: String,
            numberOfSessions: Number,
            appointments: [{type: mongoose.Schema.ObjectId, ref: 'Appointments'}]
        }],
        
        streetName: String,
        skype: String,
        answer: [{type: mongoose.Schema.ObjectId, ref: 'Answers'}],
        postalCode: String,
        success: {
            type: Boolean,
            default: true
        },
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
                default: "0"
            }
        },

        transactions: [{
            package: String,
            date: Date, 
            amount: Number,
        }],
        
        appointments: [{type: mongoose.Schema.ObjectId, ref: 'Appointments'}],      // askAPhysio: [{type: mongoose.Schema.ObjectId, ref: 'AskAPhysio'}],
        // plan: [{type: mongoose.Schema.ObjectId, ref: 'Treatments'}]
        
    }
);

patientProfilesSchema.plugin(mongoosePaginate);
var PatientProfiles = mongoose.model('patient', patientProfilesSchema);
const Client = exports.Model = PatientProfiles;

//Adding Functionalities to Model
//----------------------------Get User By ID-----------------------------------//
exports.getUserByID = function(id, callback) {
    const query = {id: id};
    Client.findById(id, callback);
};
//----------------------------Get User By Email--------------------------------//
exports.getUserByEmail = function(email, callback) {
    const query = {email: email};
    Client.findOne(query, callback);
};
//-----------------------Get User By Email Direct Return-----------------------//
exports.getUserByEmailDirect = function(email) {
    const query = {email: email};
    Client.findOne(query, (err, client) =>{
        console.log("this is the err", err);
        console.log("this is the client", client);
        if(client) {
            console.log("true");
            return true;
        } else{
            console.log("false");
            return false;
        }
    });
    console.log("OUTSIDE");
};
//--------------------Comparing Password For Authentication-------------------//
exports.comparePassword = function(candidatePass, hash, callback) {
    bcrypt.compare(candidatePass, hash, (err, isMatch) => {
        if(err) console.log("ERROR");

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
    console.log("wdjkasjdas");
    // var verificationUrl = "https://se3316lab05-mustafadawoud97.c9users.io:8081/users/verify/" + verificationTokenData;
    var emailBody = '<p>Hey, Marcotte here<p>'
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
