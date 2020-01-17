var express = require('express');
var router = express.Router();
var Genders = require('../models/Genders');

router.route('/')
    .post( function (request, response) {
        var gender = new Genders.Model(request.body.gender);
        gender.save(function (error) {
            if (error) response.send(error);
            response.json({gender: gender});
        });
    })
    .get( function (request, response) {
        Genders.Model.find(function (error, genders) {
            if (error) response.send(error);
            response.json({gender: genders});
        });
    });

router.route('/:gender_id')
    .get( function (request, response) {
        Genders.Model.findById(request.params.gender_id, function (error, gender) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({gender: gender});
            }
        });
    })
    .put( function (request, response) {
        Genders.Model.findById(request.params.gender_id, function (error, gender) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                gender.name = request.body.gender.name;
                gender.patient = request.body.gender.patient;
    


                gender.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({gender: gender});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Genders.Model.findByIdAndRemove(request.params.gender_id,
            function (error, deleted) {
                if (!error) {
                    response.json({gender: deleted});
                }
            }
        );
    });

module.exports = router;