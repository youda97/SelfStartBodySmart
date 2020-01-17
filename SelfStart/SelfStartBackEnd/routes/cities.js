var express = require('express');
var router = express.Router();
var Cities = require('../models/Cities');

router.route('/')
    .post( function (request, response) {
        var city = new Cities.Model(request.body.city);
        city.save(function (error) {
            if (error) response.send(error);
            response.json({city: city});
        });
    })
    .get( function (request, response) {
        Cities.Model.find(function (error, cities) {
            if (error) response.send(error);
            response.json({city: cities});
        });
    });

router.route('/:city_id')
    .get( function (request, response) {
        Cities.Model.findById(request.params.city_id, function (error, city) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({city: city});
            }
        });
    })
    .put( function (request, response) {
        Cities.Model.findById(request.params.city_id, function (error, city) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                city.name = request.body.city.name;
                city.province = request.body.city.province;
                // city.patient = request.body.city.patient;
    


                city.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({city: city});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Cities.Model.findByIdAndRemove(request.params.city_id,
            function (error, deleted) {
                if (!error) {
                    response.json({city: deleted});
                }
            }
        );
    });

module.exports = router;