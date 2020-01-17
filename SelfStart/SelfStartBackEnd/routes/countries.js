var express = require('express');
var router = express.Router();
var Countries = require('../models/Countries');

router.route('/')
    .post( function (request, response) {
        var country = new Countries.Model(request.body.country);
        country.save(function (error) {
            if (error) response.send(error);
            response.json({country: country});
        });
    })

    .get( function (request, response) {
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        let countryName = request.query.filter;
        if (!countryName) {
            if (!limit) {
                Countries.Model.find(function (error, countries) {
                    if (error) response.send(error);
                    response.json({country: countries});
                });
            }
            else {

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

                Countries.Model.paginate(query, options, function (error, countries) {
                    if (error) response.send(error);
                    response.json({country: countries.docs});
                });
            }
        }
        else{
            Countries.Model.find({"name": countryName.name}, function (error, countries) {
                if (error) response.send(error);
                response.json({country: countries});
            });
        }
    });

router.route('/:country_id')
    .get( function (request, response) {
        Countries.Model.findById(request.params.country_id, function (error, country) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({country: country});
            }
        });
    })
    .put( function (request, response) {
        Countries.Model.findById(request.params.country_id, function (error, country) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                country.name = request.body.country.name;
                country.provinces = request.body.country.provinces;
                      
                country.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({country: country});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Countries.Model.findByIdAndRemove(request.params.country_id,
            function (error, deleted) {
                if (!error) {
                    response.json({country: deleted});
                }
            }
        );
    });
    
module.exports = router;