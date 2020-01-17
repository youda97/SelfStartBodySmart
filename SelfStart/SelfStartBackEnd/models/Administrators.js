var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//var bcrypt=require('bcrypt');

var administratorsSchema = mongoose.Schema({
    // ID: String,
    // familyName: String,
    // givenName: String,
    email: String,
    // encryptedPassword: {type: mongoose.Schema.ObjectId, ref: 'Passwords'},
    // phoneNumber: String,
    // dateHired: Date,
    // dateFired: Date,
    message: String,
    success: {
        type: Boolean,
        default: true
    },
    // form: [{type: mongoose.Schema.ObjectId, ref: 'Forms'}],
    // account: {
    //     //New----------------------------------------
    //     nonce: String,
    //     response: String,
    //     token: String,
    //     requestType: String,
    //     wrongUserName: Boolean,
    //     wrongPassword: Boolean,
    //     passwordMustChanged: Boolean,
    //     passwordReset: Boolean,
    //     loginFailed: Boolean,
    //     sessionIsActive: Boolean,
    //     //-------------------------------------------
    //     accType:{
    //         type: String,
    //         deafult: "2"
    //     }
    // },
    

});

administratorsSchema.plugin(mongoosePaginate);
var AdministratorsSchema = mongoose.model('administrator', administratorsSchema);

const Admin = exports.Model = AdministratorsSchema;

//Adding Functionalities to Model

//----------------------------Get User By ID-----------------------------------//
exports.getUserByID = function(id, callback) {
    const query = {id: id};
    Admin.findById(id, callback);
};
//----------------------------Get User By Email--------------------------------//
exports.getUserByEmail = function(email, callback) {
    const query = {email: email};
    Admin.findOne(query, callback);
};
//-----------------------Get User By Email Direct Return-----------------------//
exports.getUserByEmailDirect = function(email) {
    const query = {email: email};
    Admin.findOne(query, (err, admin) =>{
        return admin;
    });
};
//----------------------------Add New Admin------------------------------------//
exports.addAdmin = function(admin, callback) {

    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(admin.account.encryptedPassword, salt, (err, hash) =>{
            if(err){
                throw err;
            }
            admin.account.encryptedPassword = hash;
            admin.account.salt = salt;
            console.log("THIS IS THE CLIENT", admin);
            admin.save(callback);
        });
    });
};
//--------------------Comparing Password For Authentication-------------------//
exports.comparePassword = function(candidatePass, hash, callback) {
    bcrypt.compare(candidatePass, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};