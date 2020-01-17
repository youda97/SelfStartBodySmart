// server.js

// BASE SETUP
// =============================================================================
// test

// call the packages we need
var mongoose = require('mongoose');
var express = require('express'); // call express
var bodyParser = require('body-parser');
var app = express(); // define our app using express
var port = 8082;        // set our port
var router = express.Router(); // get an instance of the express Router
var logger = require('./logger');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

//Get Instances of a few models for the purpose of the route
var Administrators = require('./models/Administrators');
var Clients = require('./models/PatientProfiles');
var Physiotherapests = require('./models/Physiotherapests');
var Passwords = require('./models/Passwords');
var Logins = require('./models/Logins');

//NEW--------------------------------------------------------------------------
var http = require('http'); 
var https = require('https');
var fs = require('fs');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
//var rand = require('csprng');
 
var rand = require('csprng');

//Setting ssl options
var sslOptions = {
    key: fs.readFileSync("./certificate/server.key"),
    cert: fs.readFileSync('./certificate/server.crt')
};
//-------------------------------------------------------------------------------

//Geting Instances of values for Authentication Purposes
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
const config = require('./config/database');
const jwt = require('jsonwebtoken');

// the following 2 middleware convert the URL reqand res to json format
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

// configure the server for developer pursposes (remove when published)
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

//Registering routes
app.use('/', router);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./config/passportAdmin')(passport);
require('./config/passportPhysio')(passport);

//IMPORT OUR ROUTES ---------------------------------
var answers = require('./routes/answers');
var photos = require('./routes/images');
var patients = require('./routes/patients');
var cities = require('./routes/cities');
var assessments = require('./routes/assessmentTests');
var forms = require('./routes/forms');
var appointments = require('./routes/appointments');
var askAPhysio = require('./routes/askAPhysio');
var excercise = require('./routes/excercise');
var provinces = require('./routes/provinces');
var recommendation = require('./routes/recommendation');
var rehabilitationplans = require('./routes/rehabilitationplans');
var countries = require('./routes/countries');
var questions = require('./routes/questions');
var treatments = require('./routes/treatments');
var genders = require('./routes/genders');
var rehabClientLinks = require('./routes/rehabClientLinks');
var pass = require('./routes/passwords');
var log = require('./routes/logins');
var exerciseList = require('./routes/exerciseList');
var questionOrder = require('./routes/questionOrder');
var answers = require('./routes/answers');
var administrators = require('./routes/administrators');
var physiotherapests = require('./routes/physiotherapests');
var roots = require('./routes/roots');
// REGISTER OUR ROUTES -------------------------------

app.use(logger);

app.use('/answers', answers);
app.use('/images', photos);
app.use('/genders', genders);
app.use('/patients', patients);
app.use('/cities', cities);
app.use('/assessmentTests', assessments);
app.use('/forms', forms);
app.use('/questions', questions);
app.use('/appointments', appointments);
app.use('/askPhysios', askAPhysio);
app.use('/exercises', excercise);
app.use('/provinces', provinces);
app.use('/recommendation', recommendation);
app.use('/rehabilitationplans', rehabilitationplans);
app.use('/countries', countries);
app.use('/treatments', treatments);
app.use('/rehabClientLinks', rehabClientLinks);
app.use('/passwords', pass);
app.use('/logins', log);
app.use('/answers', answers);
app.use('/administrators', administrators);
app.use('/physiotherapests', physiotherapests);
app.use('/exerciseLists', exerciseList);
app.use('/questionOrders', questionOrder);
app.use('/roots', roots);
//Crypto-----------------------------------------------------------
// const crypto = require('crypto');

// function hash(text) {
//     const hash = crypto.createHash('sha256');
//     hash.update(text);
//     return hash.digest('binary');
// };

// function encrypt(plainText) {
//     var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2018');
//     var crypted = cipher.update(plainText, 'ascii', 'binary');
//     crypted += cipher.final('binary');
//     return crypted;
// };

// function decrypt(cipherText) {
//     var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2018');
//     var dec = decipher.update(cipherText, 'binary', 'ascii');
//     dec += decipher.final('ascii');
//     return dec;
// };

// function failedLogin() {
//     var failed = new Logins.Model({
//         nonce: null,
//         token: null,
//         loginFailed: true
//     });
//     return failed;

//     // failed.save(function (error) {
//     //     console.log("HI");
//     //     if (error) console.log(error);
//     //     return failed;
//     // });

// };

// // function getToken(UserShadow, callback) {
// //     UserRoles.Model.find({"user": UserShadow.user}, function (error, userRoles) {
// //         if (error) response.json({login: failedLogin()});
// //         var token = ["home"];
// //         var k = 1;
// //         var n = 0;
// //         var UserRolesSize = Object.keys(userRoles).length;
// //         if (UserRolesSize === 0) {
// //             callback(token);
// //         } else {
// //             for (i = 0; i < UserRolesSize; i++) {
// //                 var roleID = userRoles[i].role;
// //                 RolePermissions.Model.find({"roleCodes": roleID}, function (error, features) {
// //                     n++;
// //                     if (error) response.json({login: failedLogin()});
// //                     var FeaturesSize = Object.keys(features).length;
// //                     if (FeaturesSize === 0) {
// //                         callback(token);
// //                     } else {
// //                         for (j = 0; j < FeaturesSize; j++) {
// //                             token[k++] = features[j].code;
// //                             if (n === UserRolesSize) {
// //                                 if (j === FeaturesSize - 1) {
// //                                     callback(token);
// //                                 }
// //                             }
// //                         }
// //                     }
// //                 });
// //             }
// //         }

// //     });
// // };
// //--------------------------------------------------------------------------

// //Routes for our API
// router.route('/authenticate')
//     .post(parseUrlencoded, parseJSON, function (request, response, next) {
//         const email = request.body.email;
//         const password = request.body.password;
//         const nonce = request.body.nonce;
//         const res = request.body.response;
//         const requestType = request.body.requestType;
//         console.log(email);
//         Passwords.getUserByEmail(email, function (error, UserShadow) {
//             console.log("usershadow:", UserShadow)
//             if(error || !UserShadow){
//                 console.log("HI");
//                 console.log(error);
//                 // console.log(UserShadow);
//                 var badUserName = new Logins.Model({
//                     email: email,
//                     password: null,
//                     nonce: null,
//                     response: null,
//                     token: null,
//                     wrongUserName: true
//                 });
//                 response.json({login: badUserName});
//             } else {
//                 Logins.Model.find({"email": email}, function (error, oldLogins) {
//                     oldLogins.forEach(function (record) {
//                         Logins.Model.findByIdAndRemove(record.id,
//                             function (error, deleted) {
//                             }
//                         );
//                     });
//                 });
//                 if(UserShadow.admin) {
//                     Administrators.findById(UserShadow.admin, function (error, user) {
//                         if (requestType === "open") {// first message in the authentication protocol
//                             var newLogin = new Logins.Model({
//                                 email: email,
//                                 password: null,
//                                 nonce: rand(256, 36), // this is the server challenge
//                                 response: null,
//                                 loginFailed: false,
//                                 token: null
//                             });

//                             newLogin.save(function (error) {// second message in the authentication protocol
//                                 if (error) response.json({login: failedLogin()});
//                                 response.json({login: newLogin});
//                             });    
//                         } 
                        
//                         else {
//                             if(requestType == "openResponse") {
//                                 if(res) {
//                                     var recievedNonce = decrypt(res);
//                                     var storedNonce = null;
//                                     Logins.Model.findOne({"email": email}, (error, message4) =>{
//                                         if(!error){
//                                             console.log("THIS IS MESSAGE4", messsage4);
//                                             console.log("THIS IS THE PASSWORD RECE", password);
//                                             storedNonce = message4.nonce;
//                                             if (recievedNonce === storedNonce) {
//                                                 var recievedPassword = password;
//                                                 var storedPassword = null;
//                                                 var salt = null;
//                                                 storedPassword = UserShadow.encryptedPassword;
//                                                 salt = UserShadow.salt;
//                                                 var saltedPassword = hash(recievedPassword + salt);
//                                                 if (saltedPassword === storedPassword) {
//                                                     if (UserShadow.passwordReset) {
//                                                         message4.token = null;
//                                                         message4.passwordReset = true;
//                                                         var rec = new Logins.Model({
//                                                             token : null,
//                                                             passwordReset : true
//                                                         });
//                                                         response.json({login: rec});
//                                                     } else {
//                                                         // getToken(UserShadow, function (token) {
//                                                         //     //console.log(token);
//                                                         //     message4.token = encrypt(JSON.stringify(token));
//                                                         //     message4.sessionIsActive = true;
//                                                         //     message4.loginFailed = false;
//                                                         //     message4.save(function (error) { // fourth message in the authentication protocol
//                                                         //         if (error) response.json({login: failedLogin()});
//                                                                 var rec = new Logins.Model({
//                                                                     // token : encrypt(JSON.stringify(token)),
//                                                                     sessionIsActive : true,
//                                                                     loginFailed : false
//                                                                 });

//                                                                 response.json({login: rec});
//                                                             // });
//                                                         // });
//                                                     }
//                                                 } else {
//                                                     // password must be wrong, server will send "wrong password" message
//                                                     message4.token = null;
//                                                     message4.nonce = null;
//                                                     message4.response = null;
//                                                     message4.wrongPassword = true;
//                                                     //console.log("wrong password");

//                                                     var rec = new Logins.Model({
//                                                         token : null,
//                                                         nonce : null,
//                                                         response : null,
//                                                         wrongPassword : true
//                                                     });
//                                                     response.json({login: rec});
//                                                 }
//                                             }
//                                             else {
//                                                 response.json({login: failedLogin()});
//                                             }
//                                         }
//                                         else {
//                                             response.json({login: failedLogin()});
//                                         }
//                                     });
//                                 }
//                                 else {
//                                     response.json({login: failedLogin()});
//                                 }
//                             } else {
//                                 if (requestType === "fetch") { //This is to maintain the instance of the current authenticated session

//                                     var connection = new Logins.Model({
//                                         email: email,
//                                         password: null,
//                                         nonce: rand(256, 36), // this is the server challenge
//                                         response: null,
//                                         token: null
//                                     });
//                                     connection.save(function (error) {// second message in the authentication protocol
//                                         if (error) response.json({login: failedLogin()});
//                                         response.json({login: connection});
//                                     });

//                                 } else {
//                                     if (requestType === "fetchResponse") {
//                                         Logins.Model.findOne({"email": email}, function (error, Fetch) {
//                                             if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
//                                             response.json({login: Fetch}); //respond to the fetch request
//                                         });
//                                     } else {
//                                         response.json({login: failedLogin()});
//                                     }
//                                 }  
//                             }
//                         }
//                     });
//                 } else if(UserShadow.practitioner) {
//                     Physiotherapests.findById(UserShadow.practitioner, function (error, user) {
//                         if (requestType === "open") {// first message in the authentication protocol
//                             var newLogin = new Logins.Model({
//                                 email: email,
//                                 password: null,
//                                 nonce: rand(256, 36), // this is the server challenge
//                                 response: null,
//                                 loginFailed: false,
//                                 token: null
//                             });

//                             newLogin.save(function (error) {// second message in the authentication protocol
//                                 if (error) response.json({login: failedLogin()});
//                                 response.json({login: newLogin});
//                             });    
//                         } 
                        
//                         else {
//                             if(requestType == "openResponse") {
//                                 if(res) {
//                                     var recievedNonce = decrypt(res);
//                                     var storedNonce = null;
//                                     Logins.Model.findOne({"email": email}, (error, message4) =>{
//                                         if(!error){
//                                             storedNonce = message4.nonce;
//                                             if (recievedNonce === storedNonce) {
//                                                 var recievedPassword = password;
//                                                 var storedPassword = null;
//                                                 var salt = null;
//                                                 storedPassword = UserShadow.encryptedPassword;
//                                                 salt = UserShadow.salt;
//                                                 var saltedPassword = hash(recievedPassword + salt);
//                                                 if (saltedPassword === storedPassword) {
//                                                     if (UserShadow.passwordReset) {
//                                                         message4.token = null;
//                                                         message4.passwordReset = true;
//                                                         var rec = new Logins.Model({
//                                                             token : null,
//                                                             passwordReset : true
//                                                         });
//                                                         response.json({login: rec});
//                                                     } else {
//                                                         // getToken(UserShadow, function (token) {
//                                                         //     //console.log(token);
//                                                         //     message4.token = encrypt(JSON.stringify(token));
//                                                         //     message4.sessionIsActive = true;
//                                                         //     message4.loginFailed = false;
//                                                         //     message4.save(function (error) { // fourth message in the authentication protocol
//                                                         //         if (error) response.json({login: failedLogin()});
//                                                                 var rec = new Logins.Model({
//                                                                     // token : encrypt(JSON.stringify(token)),
//                                                                     sessionIsActive : true,
//                                                                     loginFailed : false
//                                                                 });

//                                                                 response.json({login: rec});
//                                                             // });
//                                                         // });
//                                                     }
//                                                 } else {
//                                                     // password must be wrong, server will send "wrong password" message
//                                                     message4.token = null;
//                                                     message4.nonce = null;
//                                                     message4.response = null;
//                                                     message4.wrongPassword = true;
//                                                     //console.log("wrong password");

//                                                     var rec = new Logins.Model({
//                                                         token : null,
//                                                         nonce : null,
//                                                         response : null,
//                                                         wrongPassword : true
//                                                     });
//                                                     response.json({login: rec});
//                                                 }
//                                             }
//                                             else {
//                                                 response.json({login: failedLogin()});
//                                             }
//                                         }
//                                         else {
//                                             response.json({login: failedLogin()});
//                                         }
//                                     });
//                                 }
//                                 else {
//                                     response.json({login: failedLogin()});
//                                 }
//                             } else {
//                                 if (requestType === "fetch") { //This is to maintain the instance of the current authenticated session

//                                     var connection = new Logins.Model({
//                                         email: email,
//                                         password: null,
//                                         nonce: rand(256, 36), // this is the server challenge
//                                         response: null,
//                                         token: null
//                                     });
//                                     connection.save(function (error) {// second message in the authentication protocol
//                                         if (error) response.json({login: failedLogin()});
//                                         response.json({login: connection});
//                                     });

//                                 } else {
//                                     if (requestType === "fetchResponse") {
//                                         Logins.Model.findOne({"email": email}, function (error, Fetch) {
//                                             if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
//                                             response.json({login: Fetch}); //respond to the fetch request
//                                         });
//                                     } else {
//                                         response.json({login: failedLogin()});
//                                     }
//                                 }  
//                             }
//                         }
//                     });
//                 } else if(UserShadow.client){
//                     Clients.getUserByID(UserShadow.client, function (error, user) {
//                         console.log("hola");
//                         if (requestType === "open") {// first message in the authentication protocol
//                             var newLogin = new Logins.Model({
//                                 email: email,
//                                 password: null,
//                                 nonce: rand(256, 36), // this is the server challenge
//                                 response: null,
//                                 loginFailed: false,
//                                 token: null
//                             });

//                             newLogin.save(function (error) {// second message in the authentication protocol
//                                 if (error) response.json({login: failedLogin()});
//                                 response.json({login: newLogin});
//                             });    
//                         } 
                        
//                         else {
//                             if(requestType == "openResponse") {
//                                 console.log("OPENRESPONSE", res);
                                
//                                 if(res) {
//                                     console.log("BRO WORK")
//                                     var recievedNonce = decrypt(res);
//                                     var storedNonce = null;
//                                     Logins.Model.findOne({"email": email}, (error, message4) =>{
//                                         console.log("THIS IS MESSAGE", message4);
//                                         console.log("THIS IS THE ERROR", error);
//                                         console.log("This is the salt", UserShadow.salt);
//                                         console.log("THIS IS THE SENT PASS BEFORE HASH", password)
//                                         var newPass = hash(password + UserShadow.salt);
//                                         console.log("THIS IS THE SENT PASS AFTER THE HASH", newPass);
//                                         console.log("THIS IS THE USERSHADOW PASS", UserShadow.encryptedPassword);
//                                         if(!error){
//                                             console.log(!error);
//                                             storedNonce = message4.nonce;
//                                             console.log(recievedNonce);
//                                             console.log(storedNonce);
//                                             if (recievedNonce === storedNonce) {
//                                                 var recievedPassword = password;
//                                                 var storedPassword = null;
//                                                 var salt = null;
//                                                 storedPassword = UserShadow.encryptedPassword;
//                                                 salt = UserShadow.salt;
//                                                 // console.log("THIS IS THE rec pass", recievedPassword)
//                                                 var saltedPassword = hash(recievedPassword + salt);
//                                                 // console.log("THIS IS SALT", saltedPassword);
//                                                 // console.log("THIS IS STORED", storedPassword);
//                                                 if (saltedPassword === storedPassword) {
//                                                     if (UserShadow.passwordReset) {
//                                                         message4.token = null;
//                                                         message4.passwordReset = true;
//                                                         var rec = new Logins.Model({
//                                                             token : null,
//                                                             passwordReset : true
//                                                         });
//                                                         console.log("IN HERE");
//                                                         response.json({login: rec});
//                                                     } else {
//                                                         // getToken(UserShadow, function (token) {
//                                                         //     //console.log(token);
//                                                         //     message4.token = encrypt(JSON.stringify(token));
//                                                         //     message4.sessionIsActive = true;
//                                                         //     message4.loginFailed = false;
//                                                         //     message4.save(function (error) { // fourth message in the authentication protocol
//                                                         //         if (error) response.json({login: failedLogin()});
//                                                                 var rec = new Logins.Model({
//                                                                     // token : encrypt(JSON.stringify(token)),
//                                                                     sessionIsActive : true,
//                                                                     loginFailed : false
//                                                                 });
//                                                                 console.log("IN HERE!!");
//                                                                 response.json({login: rec});
//                                                             // });
//                                                         // });
//                                                     }
//                                                 } else {
//                                                     // password must be wrong, server will send "wrong password" message
//                                                     message4.token = null;
//                                                     message4.nonce = null;
//                                                     message4.response = null;
//                                                     message4.wrongPassword = true;
//                                                     //console.log("wrong password");
//                                                     console.log("IN BAD");
//                                                     var rec = new Logins.Model({
//                                                         token : null,
//                                                         nonce : null,
//                                                         response : null,
//                                                         wrongPassword : true
//                                                     });
//                                                     response.json({login: rec});
//                                                 }
//                                             }
//                                             else {
//                                                 console.log("FAILES LOGIN");
//                                                 var failed = failedLogin();
//                                                 console.log(failed);
//                                                 response.json({login: failed});
//                                             }
//                                         }
//                                         else {
//                                             response.json({login: failedLogin()});
//                                         }
//                                     });
//                                 }
//                                 else {
//                                     response.json({login: failedLogin()});
//                                 }
//                             } else {
//                                 if (requestType === "fetch") { //This is to maintain the instance of the current authenticated session

//                                     var connection = new Logins.Model({
//                                         email: email,
//                                         password: null,
//                                         nonce: rand(256, 36), // this is the server challenge
//                                         response: null,
//                                         token: null
//                                     });
//                                     connection.save(function (error) {// second message in the authentication protocol
//                                         if (error) response.json({login: failedLogin()});
//                                         response.json({login: connection});
//                                     });

//                                 } else {
//                                     if (requestType === "fetchResponse") {
//                                         Logins.Model.findOne({"email": email}, function (error, Fetch) {
//                                             if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
//                                             response.json({login: Fetch}); //respond to the fetch request
//                                         });
//                                     } else {
//                                         response.json({login: failedLogin()});
//                                     }
//                                 }  
//                             }
//                         }
//                     });
//                 } else {
//                     response.json({login: failedLogin()});
//                 }
//             }
//         });

        // Administrators.getUserByEmail(email, (err, admin) => {
        //     if(err) {
        //         response.json({})
        //     } 
        //     else if(admin) {
        //         Administrators.comparePassword(password, admin.account.encryptedPassword, (err, isMatch) => {
        //             if(err) throw err;

        //             if(isMatch){
        //                 const token = jwt.sign({data:admin}, config.secret, {
        //                     expiresIn: 36000 //10 hours
        //                 });

        //                 response.json({
        //                     success: true,
        //                     token: 'JWT ' + token,
        //                     user: admin
        //                 });
        //                 // return response.send();

        //             } else{
        //                 response.json({success: false, msg: 'Wrong Password'});
        //                 // return response.send();
        //             }
        //         });
        //     }
        // });
        // // return response.send();


        // Patients.getUserByEmail(email, (err, client) => {
        //     if(err) throw err;

        //     if(client){
        //         Patients.comparePassword(password, client.account.encryptedPassword, (err, isMatch) => {
        //             if(err) throw err;

        //             if(isMatch){
        //                 const token = jwt.sign({data:client}, config.secret, {
        //                     expiresIn: 36000 //10 hours
        //                 });

        //                 response.json({
        //                     success: true,
        //                     token: 'JWT ' + token,
        //                     user: client
        //                 });
        //                 console.log("asdjkasdjkaksdjasd");
        //             } else{
        //                 response.json({success: false, msg: 'Wrong Password'});
        //                 return response.send();
        //             }
        //         });
        //     }
        // });

        // // return response.send();

        // Physiotherapest.getUserByEmail(email, (err, physio) => {
        //     if(err) throw err;

        //     if(physio){
        //         Physiotherapest.comparePassword(password, physio.account.encryptedPassword, (err, isMatch) => {
        //             if(err) throw err;

        //             if(isMatch){
        //                 const token = jwt.sign({data:physio}, config.secret, {
        //                     expiresIn: 36000 //10 hours
        //                 });

        //                 response.json({
        //                     success: true,
        //                     token: 'JWT ' + token,
        //                     user: physio
        //                 });
        //                 return response.send();

        //             } else{
        //                 response.json({success: false, msg: 'Wrong Password'});
        //                 return response.send();
        //             }
        //         });
        //     }
        // });
    // });


//connect to mongoDB
mongoose.connect('mongodb://localhost/selfStart', { useMongoClient: true });

// START THE SERVER
// =============================================================================
var httpServer = http.createServer(app); 
var httpsServer = https.createServer(sslOptions, app);//.listen(8443);
httpServer.listen(port, function() {
    console.log('Magic happens on port ' + port);
});
//NEW--------------------------------------------------------------------------
// https.createServer(sslOptions, app).listen(8443);
//-----------------------------------------------------------------------------