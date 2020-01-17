var express = require('express');
var router = express.Router();
var Provinces = require('../models/Provinces');

router.route('/')
    .post( function (request, response) {
        var province = new Provinces.Model(request.body.province);
        province.save(function (error) {
            if (error) response.send(error);
            response.json({province: province});
        });
    })
    .get( function (request, response) {
        let prov = request.query.filter;


            if (!prov) {
                Provinces.Model.find(function (error, provinces) {
                    if (error) response.send(error);
                    response.json({province: provinces});
                });
            }
            else {
                if(prov.country) {
                    Provinces.Model.find({"country": prov.country}, function (error, provinces) {
                        if (error) response.send(error);
                        response.json({province: provinces});
                    });
                }
                else {
                    Provinces.Model.find({"name": prov.name}, function (error, provinces) {
                        if (error) response.send(error);
                        response.json({province: provinces});
                    });
                }
            }
    });

router.route('/:province_id')
    .get( function (request, response) {
        Provinces.Model.findById(request.params.province_id, function (error, province) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({province: province});
            }
        });
    })
    .put( function (request, response) {
        Provinces.Model.findById(request.params.province_id, function (error, province) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                province.name = request.body.province.name;
                province.country = request.body.province.country;
                province.cities = request.body.province.cities;
                // province.patient = request.body.province.patient;

                province.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({province: province});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Provinces.Model.findByIdAndRemove(request.params.province_id,
            function (error, deleted) {
                if (!error) {
                    response.json({province: deleted});
                }
            }
        );
    });
    
    

module.exports = router;