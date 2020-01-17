var express = require('express');
var router = express.Router();
var Patients = require('../models/PatientProfiles');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
const config = require('../config/database');
const jwt = require('jsonwebtoken');

//New------------------------
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
//---------------------------

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        console.log(request.body.patient);
        var patient = new Patients.Model(request.body.patient);
        console.log("hiiiiiii", patient);
        Patients.getUserByEmail(patient.email, (err, client) =>{
            if(err) {
                patient.success = false;
            }
            else if(client) {
                console.log("ERROR");
                patient.success = false;
            } 
            
            patient.save().then((patient) => {
                console.log(patient.success);
                if(!patient.success) {
                    console.log("err");
                    // console.log("this is the patient", patient);
                    response.json({patient: patient});
                } else{
                    console.log("patient");
                    Patients.sendEmail(patient);
                    response.json({patient: patient});
                }
            });
        });

        // Patients.addClient(patient, (err, patient) => {
        //     if(err) {
        //         response.json({success: false, msg: 'Failed to register client'});
        //     } else{
        //         Patients.sendEmail(patient);
        //         response.json({patient: patient});
        //     }
        // });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        let patient = request.query.filter;
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        //console.log(patient);
        if (!patient){

            if(!limit && !regex) {
                Patients.Model.find(function (error, patients) {
                    if (error) response.send(error);
                    response.json({patient: patients});
                });
            }
            else {
                //  let users = schema.users.all().models;
                //  let users = Users.Model;

                offset = Number(offset || 0);
                limit = Number(limit || 10);
                dir = dir || 'asc';
                sort = sort || 'id';

                let query = {};
                if (regex !== '')
                    query[queryPath] = new RegExp(regex, "i");

                var sortOrder = sort;
                if (sortOrder) {
                    if (dir !== 'asc') {
                        sortOrder = '-' + sort;
                    }
                }

                let options = {
                    sort: sortOrder,
                    lean: true,
                    offset: offset,
                    limit: limit
                };

                console.log("query" + query[queryPath] + regex);
                console.log("options" + JSON.stringify(options));

                Patients.Model.paginate(query, options, function (error, patients) {
                    if (error) response.send(error);
                    response.json({patient: patients.docs});
                });
            }
        }
        else{
            Patients.Model.findOne({"email": patient.email}, function (error, patients) {
                if (error) response.send(error);
                response.json({patient: patients});
            });
        }

    });

router.route('/:patient_id')

    .get(parseUrlencoded, parseJSON, function (request, response) {

        Patients.Model.findById(request.params.patient_id, function (error, patient) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({patient: patient});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Patients.Model.findById(request.params.patient_id, function (error, patient) {
            if (error) {
                response.send({error: error});
            }
            else {
                console.log(patient.packages);
                // update each attribute
                patient.ID = request.body.patient.ID;
                patient.familyName = request.body.patient.familyName;
                patient.givenName = request.body.patient.givenName;
                patient.email = request.body.patient.email;
                patient.dateOfBirth = request.body.patient.dateOfBirth;
                patient.phoneNumber = request.body.patient.phoneNumber;
                patient.healthCardNumber = request.body.patient.healthCardNumber;
                patient.gender = request.body.patient.gender;
                patient.country = request.body.patient.country;
                patient.province = request.body.patient.province;
                patient.city = request.body.patient.city;
                patient.apartment = request.body.patient.apartment;
                patient.streetNumber = request.body.patient.streetNumber;
                patient.streetName = request.body.patient.streetName;
                patient.postalCode = request.body.patient.postalCode;
                patient.appointments = request.body.patient.appointments;
                patient.rehablink = request.body.patient.rehablink;
                patient.introTest = request.body.patient.introTest;
                patient.packages = request.body.patient.packages;
                patient.images = request.body.patient.images;
                patient.answer = request.body.patient.answer;
                // patient.account = request.body.patient.account;
                patient.transactions = request.body.patient.transactions;
                patient.account = request.body.patient.account;
                patient.skype = request.body.patient.skype;
                // patient.payments = request.body.patient.payments;
                // patient.appointments = request.body.patient.appointments;
                // patient.plan = request.body.patient.plan;


                patient.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({patient: patient});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Patients.Model.findByIdAndRemove(request.params.patient_id,
            function (error, deleted) {
                if (!error) {
                    response.json({patient: deleted});
                }
            }
        );
    });

module.exports = router;