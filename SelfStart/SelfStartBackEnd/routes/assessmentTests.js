var express = require('express');
var router = express.Router();
var AssessmentTests = require('../models/AssessmentTests');

router.route('/')
    .post( function (request, response) {

        var assessmentTest = new AssessmentTests.Model(request.body.assessmentTest);
        assessmentTest.save(function (error) {
            if (error) response.send(error);
            response.json({assessmentTest: assessmentTest});
        });
    })
    .get( function (request, response) {
        let {limit, offset, sort, dir, queryPath, regex} = request.query;
        let form = request.query.filter;

        if (form) {
            AssessmentTests.Model.find({"patient": form.patient}, function (error, assessmentTests) {
                if (error) response.send(error);
                response.json({assessmentTest: assessmentTests});
            });
        }
        else {

            if (!limit) {
                AssessmentTests.Model.find(function (error, assessmentTests) {
                    if (error) response.send(error);
                    response.json({assessmentTest: assessmentTests});
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

                AssessmentTests.Model.paginate(query, options, function (error, assessmentTests) {
                    if (error) response.send(error);
                    response.json({assessmentTest: assessmentTests.docs});
                });
            }
        }
    });

router.route('/:assessment_id')
    .get( function (request, response) {
        AssessmentTests.Model.findById(request.params.assessment_id, function (error, assessmentTest) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({assessmentTest: assessmentTest});
            }
        });
    })
    .put( function (request, response) {
        AssessmentTests.Model.findById(request.params.assessment_id, function (error, assessmentTest) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                assessmentTest.name = request.body.assessmentTest.name;
                assessmentTest.description = request.body.assessmentTest.description;
                assessmentTest.rehabPlan = request.body.assessmentTest.rehabPlan;
                assessmentTest.authorName = request.body.assessmentTest.authorName;
                assessmentTest.form = request.body.assessmentTest.form;
                assessmentTest.patient = request.body.assessmentTest.patient;
                assessmentTest.answer = request.body.assessmentTest.answer;

                assessmentTest.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({assessmentTest: assessmentTest});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        AssessmentTests.Model.findByIdAndRemove(request.params.assessment_id,
            function (error, deleted) {
                if (!error) {
                    response.json({assessmentTest: deleted});
                }
            }
        );
    });

module.exports = router;