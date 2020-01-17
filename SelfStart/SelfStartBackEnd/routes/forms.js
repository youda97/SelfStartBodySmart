var express = require('express');
var router = express.Router();
var Forms = require('../models/Forms');

router.route('/')
        .post(function (request, response) {
            var form = new Forms.Model(request.body.form);
            form.save(function (error) {
                if (error) response.send(error);
                response.json({form: form});
            });
        })
        
        .get(function (request, response) {
            let {limit, offset, sort, dir, queryPath, regex} = request.query;
            let form = request.query.filter;

            if (form) {
                Forms.Model.find({"name": form.name}, function (error, forms) {
                    if (error) response.send(error);
                    response.json({form: forms});
                });
            }
            else {

                if (!limit) {
                    Forms.Model.find(function (error, forms) {
                        if (error) response.send(error);
                        response.json({form: forms});
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

                    Forms.Model.paginate(query, options, function (error, forms) {
                        if (error) response.send(error);
                        response.json({form: forms.docs});
                    });
                }
            }

        });

router.route('/:form_id')
        .get(function (request, response) {
            Forms.Model.findById(request.params.form_id, function (error, form) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({form: form});
                }
            });
        })
        
        .put(function (request, response) {
            Forms.Model.findById(request.params.form_id, function (error, form) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    
                    // update each attribute
                    form.name = request.body.form.name;
                    form.description = request.body.form.description;
                    form.author = request.body.form.author;
                    form.assessmentTest = request.body.form.assessmentTest;
                    form.questions = request.body.form.questions;
                    form.answer = request.body.form.answer;
                    form.questionOrder = request.body.form.questionOrder;
                    
                    form.save(function (error) {
                        if (error) {
                            response.send({error: error});
                        }
                        else {
                            response.json({form: form});
                        }
                    });
                }
            });
        })
        
        .delete(function (request, response) {
            Forms.Model.findByIdAndRemove(request.params.form_id, function (error, deleted) {
                if (!error) {
                    response.json({form: deleted});
                }
            });
        });
        
module.exports = router;
