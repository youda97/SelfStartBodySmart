var express = require('express');
var router = express.Router();
var Questions = require('../models/Questions');

router.route('/')
        .post(function (request, response) {
            var question = new Questions.Model(request.body.question);
            question.save(function (error) {
                if (error) response.send(error);
                response.json({question: question});
            });
        })
        
        .get(function (request, response) {
            let {sort, dir, queryPath, regex} = request.query;

            if (!sort && !regex){


                Questions.Model.find(function (error, questions) {
                    if (error) response.send(error);
                    response.json({question: questions});
                });
            }
            else{

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
                };

                Questions.Model.paginate(query, options, function (error, questions) {
                    if (error) response.send(error);
                    response.json({question: questions.docs});
                });
            }

        });

router.route('/:question_id')
        .get(function (request, response) {
            Questions.Model.findById(request.params.question_id, function (error, question) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({question: question});
                }
            });
        })
        
        .put(function (request, response) {
            Questions.Model.findById(request.params.question_id, function (error, question) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    
                    // update each attribute
                    question.questionText = request.body.question.questionText;
                    question.helpDescription = request.body.question.helpDescription;
                    question.type = request.body.question.type;
                    question.optionNumber = request.body.question.optionNumber;
                    question.optionString = request.body.question.optionString;
                    question.forms = request.body.question.forms;
                    question.mc = request.body.question.mc;
                    question.sa = request.body.question.sa;
                    question.ra = request.body.question.ra;
                    question.tf = request.body.question.tf;
                    question.answer = request.body.question.answer;
                    question.questionOrder = request.body.question.questionOrder;
                
                    question.save(function (error) {
                        if (error) {
                            response.send({error: error});
                        }
                        else {
                            response.json({question: question});
                        }
                    });
                }
            });
        })
        
        .delete(function (request, response) {
            Questions.Model.findByIdAndRemove(request.params.question_id, function (error, deleted) {
                if (!error) {
                    response.json({question: deleted});
                }
            });
        });
        
module.exports = router;
