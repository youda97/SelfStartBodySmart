var express = require('express');
var router = express.Router();
var Physiotherapest = require('../models/Physiotherapests');

router.route('/')
    .post(function (request, response) {
        var physiotherapest = new Physiotherapest.Model(request.body.physiotherapest);
        Physiotherapest.getUserByEmail(physiotherapest.email, (err, practiioner) => {
            console.log("THIS IS THE PHSIO THE RAPER", practiioner);
            console.log("This the line after the raper", physiotherapest);
            if(err) {
                practiioner.success = false;
            }
            else if(practiioner) {
                console.log("ERROR");
                practiioner.success = false;
            }
            physiotherapest.save(function (error) {
                console.log(error);
                if (error) response.send(error);
                response.json({physiotherapest: physiotherapest});
            }); 
        });
    })

    .get( function (request, response) {
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        var email = request.query.filter;

        if (email){
            if (email.email){
                console.log(email.email);
                console.log('find physio using email');
                Physiotherapest.Model.findOne({'email': email.email}, function (error, physiotherapest) {
                    if (error)
                        response.send(error);
                    response.json({physiotherapest: physiotherapest});
                });
            }

        }
        else {
            if (!limit) {
                Physiotherapest.Model.find(function (error, physiotherapest) {
                    if (error) response.send(error);
                    response.json({physiotherapest: physiotherapest});
                });
            }

            else {
                console.log('not');
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
                Physiotherapest.Model.paginate(query, options, function (error, physiotherapest) {
                    if (error) response.send(error);
                    response.json({physiotherapest: physiotherapest.docs});
                });
            }
        }
    });

router.route('/:physiotherapest_id')
    .get(function (request, response) {
        Physiotherapest.Model.findById(request.params.physiotherapest_id, function (error, physiotherapest) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({physiotherapest: physiotherapest});
            }
        });
    })

    .put(function (request, response) {
        Physiotherapest.Model.findById(request.params.physiotherapest_id, function (error, physiotherapest) {
            if (error) {
                response.send({error: error});
            } else if(request.params.updatingValue){
                Physiotherapest.sendEmail();
                response.json({physiotherapest: physiotherapest});
            } else {
                physiotherapest.ID = request.body.physiotherapest.ID;
                physiotherapest.familyName = request.body.physiotherapest.familyName;
                physiotherapest.givenName = request.body.physiotherapest.givenName;
                physiotherapest.email = request.body.physiotherapest.email;
                physiotherapest.dateHired = request.body.physiotherapest.dateHired;
                physiotherapest.dateFired = request.body.physiotherapest.dateFired;
                physiotherapest.gender = request.body.physiotherapest.gender;
                physiotherapest.phoneNumber = request.body.physiotherapest.phoneNumber;
                physiotherapest.treatment = request.body.physiotherapest.treatment;
                physiotherapest.account = request.body.physiotherapest.account;
                physiotherapest.appointments = request.body.physiotherapest.appointments;

                physiotherapest.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({physiotherapest: physiotherapest});
                    }
                });
            }
        });
    })

    .delete(function (request, response) {
        Physiotherapest.Model.findByIdAndRemove(request.params.physiotherapest_id, function (error, deleted) {
            if (!error) {
                response.json({physiotherapest: deleted});
            }
        });
    });

module.exports = router;