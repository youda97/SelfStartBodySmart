var express = require('express');
var router = express.Router();
var Treatment = require('../models/Treatments.js');

router.route('/')
        .post(function (request, response) {
            var treatment = new Treatment.Model(request.body.recommendation);
            treatment.save(function (error) {
                if (error) response.send(error);
                response.json({recommendation: treatment});
            });
        })
        
        .get(function (request, response) {
            Treatment.Model.find(function (error, treatment) {
                if (error) response.send(error);
                response.json({recommendation: treatment});
            });
        });

router.route('/:treatments_id')
        .get(function (request, response) {
            Treatment.Model.findById(request.params.treatments_id, function (error, treatment) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({treatment: treatment});
                }
            });
        })
        
        .put(function (request, response) {
            Treatment.Model.findById(request.params.treatments_id, function (error, treatment) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    treatment.timeStamp = request.body.treatment.dateAssign;
                    treatment.response = request.body.treatment.response;
                    treatment.rehabilitationPlan = request.body.treatment.rehabilitationPlan;
                    treatment.physio = request.body.treatment.physio;
                    
                    treatment.save(function (error) {
                        if (error) {
                            response.send({error: error});
                        }
                        else {
                            response.json({treatment: treatment});
                        }
                    });
                }
            });
        })
        
        .delete(function (request, response) {
            Treatment.Model.findByIdAndRemove(request.params.treatments_id, function (error, deleted) {
                if (!error) {
                    response.json({recommendation: deleted});
                }
            });
        });
        
module.exports = router;
