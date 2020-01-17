var express = require('express');
var router = express.Router();
var Recommendation = require('../models/Recommendations.js');

router.route('/')
        .post(function (request, response) {
            var recommendation = new Recommendation.Model(request.body.recommendation);
            recommendation.save(function (error) {
                if (error) response.send(error);
                response.json({recommendation: recommendation});
            });
        })
        
        .get(function (request, response) {
            Recommendation.Model.find(function (error, recommendation) {
                if (error) response.send(error);
                response.json({recommendation: recommendation});
            });
        });

router.route('/:recommendations_id')
        .get(function (request, response) {
            Recommendation.Model.findById(request.params.recommendations_id, function (error, recommendation) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({recommendation: recommendation});
                }
            });
        })
        
        .put(function (request, response) {
            Recommendation.Model.findById(request.params.recommendations_id, function (error, recommendation) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    recommendation.timeStamp = request.body.recommendation.date;
                    recommendation.decision = request.body.recommendation.decision;
                    recommendation.treatment = request.body.recommendation.treatment;
                    recommendation.test = request.body.recommendation.test;
                    
                    recommendation.save(function (error) {
                        if (error) {
                            response.send({error: error});
                        }
                        else {
                            response.json({recommendation: recommendation});
                        }
                    });
                }
            });
        })
        
        .delete(function (request, response) {
            Recommendation.Model.findByIdAndRemove(request.params.recommendations_id, function (error, deleted) {
                if (!error) {
                    response.json({recommendation: deleted});
                }
            });
        });
        
module.exports = router;
