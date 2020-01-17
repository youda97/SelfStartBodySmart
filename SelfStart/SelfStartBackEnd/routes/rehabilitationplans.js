var express = require('express');
var router = express.Router();
var Rehabilitation = require('../models/RehabilitationPlans');

router.route('/')
    .post( function (request, response) {
        var rehabilitation = new Rehabilitation.Model(request.body.rehabilitationplan);
        rehabilitation.save(function (error) {
            if (error) response.send(error);
            response.json({rehabilitationplan: rehabilitation});
        });
    })
    .get( function (request, response) {
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        if(!limit) {
            Rehabilitation.Model.find(function (error, rehabilitations) {
                if (error) response.send(error);
                response.json({rehabilitationplan: rehabilitations});
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

            Rehabilitation.Model.paginate(query, options, function (error, rehabilitations) {
                if (error) response.send(error);
                response.json({rehabilitationplan: rehabilitations.docs});
            });
        }
    });


router.route('/:rehabilitation_id')
    .get( function (request, response) {
        Rehabilitation.Model.findById(request.params.rehabilitation_id, function (error, rehabilitations) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({rehabilitationplan: rehabilitations});
            }
        });
    })

    .put( function (request, response) {
        console.log("update on rehab plan");
        Rehabilitation.Model.findById(request.params.rehabilitation_id, function (error, rehabilitation) {
            if (error) {
                //send error message
                response.send({error: error});
            }
            else {
                // update each attribute

                rehabilitation.planName = request.body.rehabilitationplan.planName;
                rehabilitation.description = request.body.rehabilitationplan.description;
                rehabilitation.physioID = request.body.rehabilitationplan.physioID;
                rehabilitation.date = request.body.rehabilitationplan.date;
                //rehabilitation.plan = request.body.rehabilitationplan.plan;
                rehabilitation.assessmentTests = request.body.rehabilitationplan.assessmentTests;
                rehabilitation.exerciseList = request.body.rehabilitationplan.exerciseList;

                rehabilitation.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({rehabilitationplan: rehabilitation});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        console.log("delete on rehab plan");
        Rehabilitation.Model.findByIdAndRemove(request.params.rehabilitation_id,
            function (error, deleted) {
                if (!error) {
                    response.json({rehabilitationplan: deleted});
                }
            }
        );
    });

module.exports = router;