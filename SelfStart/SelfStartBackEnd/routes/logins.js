var express = require('express');
var router = express.Router();
var UserRoles = require('../models/UserRoles');
var Passwords = require('../models/Passwords');
var Logins = require('../models/Logins');

//Get Instances of a few models for the purpose of the route
var Administrators = require('../models/Administrators');
var Clients = require('../models/PatientProfiles');
var Physiotherapests = require('../models/Physiotherapests');

var RolePermissions = require('../models/RolePermissions');


var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
const crypto = require('crypto');
var rand = require('csprng');

function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
};

function encrypt(plainText) {
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2018');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

function decrypt(cipherText) {
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2018');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
};

function failedLogin() {
    var failed = new Logins.Model({
        nonce: null,
        token: null,
        loginFailed: true
    });

    failed.save(function (error) {
        // if (error) return console.error(error);
        return failed;
    });

};

function getToken(UserShadow, callback) {
    UserRoles.Model.find({"user": UserShadow.user}, function (error, userRoles) {
        if (error) response.json({login: failedLogin()});
        var token = ["home"];
        var k = 1;
        var n = 0;
        var UserRolesSize = Object.keys(userRoles).length;
        if (UserRolesSize === 0) {
            callback(token);
        } else {
            for (i = 0; i < UserRolesSize; i++) {
                var roleID = userRoles[i].role;
                RolePermissions.Model.find({"roleCodes": roleID}, function (error, features) {
                    n++;
                    if (error) response.json({login: failedLogin()});
                    var FeaturesSize = Object.keys(features).length;
                    if (FeaturesSize === 0) {
                        callback(token);
                    } else {
                        for (j = 0; j < FeaturesSize; j++) {
                            token[k++] = features[j].code;
                            if (n === UserRolesSize) {
                                if (j === FeaturesSize - 1) {
                                    callback(token);
                                }
                            }
                        }
                    }
                });
            }
        }

    });
};

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        console.log("Hi");
        Passwords.getUserByEmail(request.body.login.email, function (error, UserShadow) {
            console.log("this is user shadow", UserShadow);
            if(error || !UserShadow){
                console.log("Error - User shadow not found");
                console.log("error", error);
                var badUserName = new Logins.Model({
                    email: request.body.login.email,
                    password: null,
                    nonce: null,
                    response: null,
                    token: null,
                    wrongUserName: true
                });
                
                badUserName.save();
                response.json({login: badUserName});
            } else {
                if(UserShadow.admin) {
                    Administrators.getUserByID(UserShadow.admin, function (error, user) {
                        console.log("In client");
                        if (request.body.login.requestType === "open") {// first message in the authentication protocol
                            // make sure to delete any leftover logins from any previous session for the same user if any.
                            Logins.Model.find({"email": request.body.login.email}, function (error, oldLogins) {
                                oldLogins.forEach(function (record) {
                                    Logins.Model.findByIdAndRemove(record.id,
                                        function (error, deleted) {
                                        }
                                    );
                                });
                            });

                            var newLogin = new Logins.Model({
                                email: request.body.login.email,
                                password: null,
                                nonce: rand(256, 36), // this is the server challenge
                                response: null,
                                loginFailed: false,
                                token: null
                            });
                            newLogin.save(function (error) {// second message in the authentication protocol
                                if (error) response.json({login: failedLogin()});
                                response.json({login: newLogin});
                            });
                        } else {
                            if (request.body.login.requestType === "openResponse") { // third message in the authentication protocol
                                // Now we need to verfiy the receieved nonce and the password
                                if (request.body.login.response) {
                                    var recievedNonce = decrypt(request.body.login.response);
                                    var storedNonce = null;
                                    Logins.Model.findOne({"email": request.body.login.email}, function (error, message4) {
                                        if (!error) {
                                            console.log("message4 ", message4);
                                            console.log("USERSHADOW", UserShadow);
                                            storedNonce = message4.nonce;
                                            if (recievedNonce === storedNonce) {
                                                // Now this session is confirmed fresh. Let us authenticate the user.
                                                var recievedPassword = request.body.login.password + UserShadow.salt;
                                                var storedPassword = null;
                                                var salt = null;
                                                storedPassword = UserShadow.encryptedPassword;
                                                salt = UserShadow.salt;
                                                var saltedPassword = hash(recievedPassword);
                                                // console.log("One hash + salt", recievedPassword);
                                                console.log("SALTED", saltedPassword);
                                                // console.log("RECIEVED", request.body.login.password);
                                                console.log("STORED", storedPassword);
                                                // console.log("SALT", UserShadow.salt);

                                                if (saltedPassword === storedPassword) {
                                                    // Now the user is authenticated.
                                                    //
                                                    // if password is pending change, server will send a message
                                                    // letting the user to change password and then try login again
                                                    //
                                                    // if not pending change server will send the encrypted token
                                                    // (the capability list).
                                                    if (UserShadow.passwordReset) {
                                                        message4.token = null;
                                                        message4.passwordReset = true;
                                                        var rec = new Logins.Model({
                                                            token : null,
                                                            passwordReset : true
                                                        });
                                                        rec.save();
                                                        response.json({login: rec});
                                                    } else {
                                                        // get the user role
                                                        // getToken(UserShadow, function (token) {
                                                            //console.log(token);
                                                            // message4.token = encrypt(JSON.stringify(token));
                                                            message4.sessionIsActive = true;
                                                            message4.loginFailed = false;
                                                            message4.save(function (error) { // fourth message in the authentication protocol
                                                                if (error) response.json({login: failedLogin()});

                                                                var rec = new Logins.Model({
                                                                    // token : encrypt(JSON.stringify(token)),
                                                                    sessionIsActive : true,
                                                                    loginFailed : false
                                                                });
                                                                rec.save();
                                                                response.json({login: rec});
                                                            });
                                                        // });
                                                    }
                                                } else {
                                                    // password must be wrong, server will send "wrong password" message
                                                    message4.token = null;
                                                    message4.nonce = null;
                                                    message4.response = null;
                                                    message4.wrongPassword = true;
                                                    //console.log("wrong password");

                                                    var rec = new Logins.Model({
                                                        token : null,
                                                        nonce : null,
                                                        response : null,
                                                        wrongPassword : true
                                                    });
                                                    rec.save();
                                                    response.json({login: rec});
                                                }
                                            } else {
                                                response.json({login: failedLogin()});
                                            }
                                        } else {
                                            response.json({login: failedLogin()});
                                        }
                                    });
                                } else {
                                    response.json({login: failedLogin()});
                                }
                            } else {
                                if (request.body.login.requestType === "fetch") { //This is to maintain the instance of the current authenticated session

                                    var connection = new Logins.Model({
                                        email: request.body.login.email,
                                        password: null,
                                        nonce: rand(256, 36), // this is the server challenge
                                        response: null,
                                        token: null
                                    });
                                    connection.save(function (error) {// second message in the authentication protocol
                                        if (error) response.json({login: failedLogin()});
                                        response.json({login: connection});
                                    });
                                } else {
                                    if (request.body.login.requestType === "fetchResponse") {
                                        Logins.Model.findOne({"email": request.body.login.email}, function (error, Fetch) {
                                            if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
                                            response.json({login: Fetch}); //respond to the fetch request
                                        });
                                    } else {
                                        response.json({login: failedLogin()});
                                    }
                                }
                            }
                        }
                    });
                } else if(UserShadow.practitioner) {
                    Physiotherapests.getUserByID(UserShadow.practitioner, function (error, user) {
                        console.log("In Practitioner");
                        if (request.body.login.requestType === "open") {// first message in the authentication protocol
                            // make sure to delete any leftover logins from any previous session for the same user if any.
                            Logins.Model.find({"email": request.body.login.email}, function (error, oldLogins) {
                                oldLogins.forEach(function (record) {
                                    Logins.Model.findByIdAndRemove(record.id,
                                        function (error, deleted) {
                                        }
                                    );
                                });
                            });

                            var newLogin = new Logins.Model({
                                email: request.body.login.email,
                                password: null,
                                nonce: rand(256, 36), // this is the server challenge
                                response: null,
                                loginFailed: false,
                                token: null
                            });
                            newLogin.save(function (error) {// second message in the authentication protocol
                                if (error) response.json({login: failedLogin()});
                                response.json({login: newLogin});
                            });
                        } else {
                            if (request.body.login.requestType === "openResponse") { // third message in the authentication protocol
                                // Now we need to verfiy the receieved nonce and the password
                                if (request.body.login.response) {
                                    var recievedNonce = decrypt(request.body.login.response);
                                    var storedNonce = null;
                                    Logins.Model.findOne({"email": request.body.login.email}, function (error, message4) {
                                        if (!error) {
                                            console.log("message4 ", message4);
                                            console.log("USERSHADOW", UserShadow);
                                            storedNonce = message4.nonce;
                                            if (recievedNonce === storedNonce) {
                                                // Now this session is confirmed fresh. Let us authenticate the user.
                                                var recievedPassword = request.body.login.password + UserShadow.salt;
                                                var storedPassword = null;
                                                var salt = null;
                                                storedPassword = UserShadow.encryptedPassword;
                                                salt = UserShadow.salt;
                                                var saltedPassword = hash(recievedPassword);
                                                // console.log("One hash + salt", recievedPassword);
                                                console.log("SALTED", saltedPassword);
                                                // console.log("RECIEVED", request.body.login.password);
                                                console.log("STORED", storedPassword);
                                                // console.log("SALT", UserShadow.salt);

                                                if (saltedPassword === storedPassword) {
                                                    // Now the user is authenticated.
                                                    //
                                                    // if password is pending change, server will send a message
                                                    // letting the user to change password and then try login again
                                                    //
                                                    // if not pending change server will send the encrypted token
                                                    // (the capability list).
                                                    if (UserShadow.passwordReset) {
                                                        message4.token = null;
                                                        message4.passwordReset = true;
                                                        var rec = new Logins.Model({
                                                            token : null,
                                                            passwordReset : true
                                                        });
                                                        rec.save();
                                                        response.json({login: rec});
                                                    } else {
                                                        // get the user role
                                                        // getToken(UserShadow, function (token) {
                                                            //console.log(token);
                                                            // message4.token = encrypt(JSON.stringify(token));
                                                            message4.sessionIsActive = true;
                                                            message4.loginFailed = false;
                                                            message4.save(function (error) { // fourth message in the authentication protocol
                                                                if (error) response.json({login: failedLogin()});

                                                                var rec = new Logins.Model({
                                                                    // token : encrypt(JSON.stringify(token)),
                                                                    sessionIsActive : true,
                                                                    loginFailed : false
                                                                });
                                                                rec.save();
                                                                response.json({login: rec});
                                                            });
                                                        // });
                                                    }
                                                } else {
                                                    // password must be wrong, server will send "wrong password" message
                                                    message4.token = null;
                                                    message4.nonce = null;
                                                    message4.response = null;
                                                    message4.wrongPassword = true;
                                                    //console.log("wrong password");

                                                    var rec = new Logins.Model({
                                                        token : null,
                                                        nonce : null,
                                                        response : null,
                                                        wrongPassword : true
                                                    });
                                                    rec.save();
                                                    response.json({login: rec});
                                                }
                                            } else {
                                                response.json({login: failedLogin()});
                                            }
                                        } else {
                                            response.json({login: failedLogin()});
                                        }
                                    });
                                } else {
                                    response.json({login: failedLogin()});
                                }
                            } else {
                                if (request.body.login.requestType === "fetch") { //This is to maintain the instance of the current authenticated session

                                    var connection = new Logins.Model({
                                        email: request.body.login.email,
                                        password: null,
                                        nonce: rand(256, 36), // this is the server challenge
                                        response: null,
                                        token: null
                                    });
                                    connection.save(function (error) {// second message in the authentication protocol
                                        if (error) response.json({login: failedLogin()});
                                        response.json({login: connection});
                                    });
                                } else {
                                    if (request.body.login.requestType === "fetchResponse") {
                                        Logins.Model.findOne({"email": request.body.login.email}, function (error, Fetch) {
                                            if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
                                            response.json({login: Fetch}); //respond to the fetch request
                                        });
                                    } else {
                                        response.json({login: failedLogin()});
                                    }
                                }
                            }
                        }
                    });
                } else if(UserShadow.client) {
                    Clients.getUserByID(UserShadow.client, function (error, user) {
                        console.log("In client");
                        if (request.body.login.requestType === "open") {// first message in the authentication protocol
                            // make sure to delete any leftover logins from any previous session for the same user if any.
                            Logins.Model.find({"email": request.body.login.email}, function (error, oldLogins) {
                                oldLogins.forEach(function (record) {
                                    Logins.Model.findByIdAndRemove(record.id,
                                        function (error, deleted) {
                                        }
                                    );
                                });
                            });

                            var newLogin = new Logins.Model({
                                email: request.body.login.email,
                                password: null,
                                nonce: rand(256, 36), // this is the server challenge
                                response: null,
                                loginFailed: false,
                                token: null
                            });
                            newLogin.save(function (error) {// second message in the authentication protocol
                                if (error) response.json({login: failedLogin()});
                                response.json({login: newLogin});
                            });
                        } else {
                            if (request.body.login.requestType === "openResponse") { // third message in the authentication protocol
                                // Now we need to verfiy the receieved nonce and the password
                                if (request.body.login.response) {
                                    var recievedNonce = decrypt(request.body.login.response);
                                    var storedNonce = null;
                                    Logins.Model.findOne({"email": request.body.login.email}, function (error, message4) {
                                        if (!error) {
                                            console.log("message4 ", message4);
                                            console.log("USERSHADOW", UserShadow);
                                            storedNonce = message4.nonce;
                                            if (recievedNonce === storedNonce) {
                                                // Now this session is confirmed fresh. Let us authenticate the user.
                                                var recievedPassword = request.body.login.password + UserShadow.salt;
                                                var storedPassword = null;
                                                var salt = null;
                                                storedPassword = UserShadow.encryptedPassword;
                                                salt = UserShadow.salt;
                                                var saltedPassword = hash(recievedPassword);
                                                // console.log("One hash + salt", recievedPassword);
                                                console.log("SALTED", saltedPassword);
                                                // console.log("RECIEVED", request.body.login.password);
                                                console.log("STORED", storedPassword);
                                                // console.log("SALT", UserShadow.salt);

                                                if (saltedPassword === storedPassword) {
                                                    // Now the user is authenticated.
                                                    //
                                                    // if password is pending change, server will send a message
                                                    // letting the user to change password and then try login again
                                                    //
                                                    // if not pending change server will send the encrypted token
                                                    // (the capability list).
                                                    if (UserShadow.passwordReset) {
                                                        message4.token = null;
                                                        message4.passwordReset = true;
                                                        var rec = new Logins.Model({
                                                            token : null,
                                                            passwordReset : true
                                                        });
                                                        rec.save();
                                                        response.json({login: rec});
                                                    } else {
                                                        // get the user role
                                                        // getToken(UserShadow, function (token) {
                                                            //console.log(token);
                                                            // message4.token = encrypt(JSON.stringify(token));
                                                            message4.sessionIsActive = true;
                                                            message4.loginFailed = false;
                                                            message4.save(function (error) { // fourth message in the authentication protocol
                                                                if (error) response.json({login: failedLogin()});

                                                                var rec = new Logins.Model({
                                                                    // token : encrypt(JSON.stringify(token)),
                                                                    sessionIsActive : true,
                                                                    loginFailed : false
                                                                });
                                                                rec.save();
                                                                response.json({login: rec});
                                                            });
                                                        // });
                                                    }
                                                } else {
                                                    // password must be wrong, server will send "wrong password" message
                                                    message4.token = null;
                                                    message4.nonce = null;
                                                    message4.response = null;
                                                    message4.wrongPassword = true;
                                                    //console.log("wrong password");

                                                    var rec = new Logins.Model({
                                                        token : null,
                                                        nonce : null,
                                                        response : null,
                                                        wrongPassword : true
                                                    });
                                                    rec.save();
                                                    response.json({login: rec});
                                                }
                                            } else {
                                                response.json({login: failedLogin()});
                                            }
                                        } else {
                                            response.json({login: failedLogin()});
                                        }
                                    });
                                } else {
                                    response.json({login: failedLogin()});
                                }
                            } else {
                                if (request.body.login.requestType === "fetch") { //This is to maintain the instance of the current authenticated session

                                    var connection = new Logins.Model({
                                        email: request.body.login.email,
                                        password: null,
                                        nonce: rand(256, 36), // this is the server challenge
                                        response: null,
                                        token: null
                                    });
                                    connection.save(function (error) {// second message in the authentication protocol
                                        if (error) response.json({login: failedLogin()});
                                        response.json({login: connection});
                                    });
                                } else {
                                    if (request.body.login.requestType === "fetchResponse") {
                                        Logins.Model.findOne({"email": request.body.login.email}, function (error, Fetch) {
                                            if (error || !Fetch || !Fetch.sessionIsActive) response.json({login: failedLogin()});
                                            response.json({login: Fetch}); //respond to the fetch request
                                        });
                                    } else {
                                        response.json({login: failedLogin()});
                                    }
                                }
                            }
                        }
                    });
                } else {
                    response.json({login: failedLogin()});
                } 
            }
        });
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        var LOGIN = request.query.filter;
        if (!LOGIN) {
            Logins.Model.find(function (error, Login) {
                if (error) response.json({login: failedLogin()});
                response.json({login: Login});
            });
        } else {
            Logins.Model.findOne({"email": LOGIN.email}, function (error, Login) {
                if (error) response.json({login: failedLogin()});
                response.json({login: Login});
            });
        }
    });


router.route('/:login_id')
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Logins.Model.findByIdAndRemove(request.params.login_id,
            function (error, deleted) {
                if (!error) {
                    response.json({login: deleted});
                }
            }
        );
    });

module.exports = router;
