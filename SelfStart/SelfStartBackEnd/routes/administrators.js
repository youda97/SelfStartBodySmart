var express = require('express');
var router = express.Router();
var Administrators = require('../models/Administrators');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
const config = require('../config/database');
const jwt = require('jsonwebtoken');

router.route('/')
    .post( function (request, response) {
        var ad = new Administrators.Model(request.body.administrator);
        console.log(ad.email);
        Administrators.getUserByEmail(ad.email, (err, administrator) =>{
            if(administrator) {
                console.log("ERROR");
                ad.success = false;
            } 
            
            ad.save().then((adm) => {
                console.log(adm);
                response.json({administrator: adm});
            });
        });

        // Administrators.addAdmin(administrator, (err, administrator) => {
        //     console.log("ASDJKkajsdkjsajkd");
        //     if(err) {
        //         response.json({success: false, msg: 'Failed to register client'});
        //     } else{
        //         response.json({administrator: admin});
        //     }
        // });
        // Administrators.save(function (error) {
        //     if (error) response.send(error);
        //     response.json({admin: admin});
        // });
    })

    .get( function (request, response) {
        let ad = request.query.filter;
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        if(ad) {
            Administrators.Model.find(function (error, admins) {
                if (error) response.send(error);
                response.json({administrator: admins});
            });
        }
        else {
        if(!limit) {
            Administrators.Model.find(function (error, administrators) {
                if (error) response.send(error);
                response.json({administrator: administrators});
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
            Administrators.Model.paginate(query, options, function (error, administrators) {
                if (error) response.send(error);
                response.json({administrator: administrators.docs});
            });
        }
    }
    });

// router.route('/:email')

//     .get( function (request, response) {

//         Administrators.getUserByEmail(request.params.email, function (error, administrator) {
//             if (error) {
//                 response.send({error: error});
//             }
//             else {
//                 response.json({success: true, administrator: administrator});
//             }
//         });
//     });

router.route('/:administrator_id')
    .get( function (request, response) {
        Administrators.Model.findById(request.params.administrator_id, function (error, administrator) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({administrator: administrator});
            }
        });
    })
    .put( function (request, response) {
        Administrators.Model.findById(request.params.administrator_id, function (error, administrator) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                // administrator.ID = request.body.administrator.ID;
                // administrator.familyName = request.body.administrator.familyName;
                // administrator.givenName = request.body.administrator.givenName;
                administrator.email = request.body.administrator.email;
                // administrator.dateHired = request.body.administrator.dateHired;
                // administrator.dateFired = request.body.administrator.dateFired;
                // administrator.phoneNumber = request.body.administrator.phoneNumber;
                // administrator.form = request.body.administrator.form;
                // administrator.account = request.body.administrator.account;
                administrator.message = request.body.administrator.message;

                administrator.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({administrator: administrator});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Administrators.Model.findByIdAndRemove(request.params.administrator_id,
            function (error, deleted) {
                if (!error) {
                    response.json({administrator: deleted});
                }
            }
        );
    });

module.exports = router;