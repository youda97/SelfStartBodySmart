var express = require('express');
var router = express.Router();
var MaritalStatuses = require('../models/MaritalStatuses');

router.route('/')
    .post( function (request, response) {

        var status = new MaritalStatuses.Model(request.body.maritalStatus);

        status.save(function (error) {
            if (error) response.send(error);
            response.json({maritalStatus: status});
        });
    })
    .get( function (request, response) {
        MaritalStatuses.Model.find(function (error, statuses) {
            if (error) response.send(error);
            response.json({maritalStatus: statuses});
        });
    });


router.route('/:maritalStatus_id')
    .get( function (request, response) {
        MaritalStatuses.Model.findById(request.params.maritalStatus_id, function (error, status) {

            if (error) {
                response.send({error: error});
            }
            else {
                response.json({maritalStatus: status});
            }
        });
    })
    .put( function (request, response) {

        MaritalStatuses.Model.findById(request.params.maritalStatus_id, function (error, maritalStatus) {

            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute

                maritalStatus.name = request.body.maritalStatus.name;


                maritalStatus.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {

                        response.json({maritalStatus: maritalStatus});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {

        MaritalStatuses.Model.findByIdAndRemove(request.params.maritalStatus_id,
            function (error, deleted) {
                if (!error) {
                    response.json({maritalStatus: deleted});
                }
            }
        );
    });

module.exports = router;