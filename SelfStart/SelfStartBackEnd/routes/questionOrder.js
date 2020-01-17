var express = require('express');
var router = express.Router();
var QuestionOrder = require('../models/QuestionOrder');

router.route('/')
        .post(function (request, response) {
            var questionOrder = new QuestionOrder.Model(request.body.questionOrder);
            questionOrder.save(function (error) {
                if (error) response.send(error);
                response.json({questionOrder: questionOrder});
            });
        })
        
        .get(function (request, response) {
            var order =  request.query.filter;
            console.log(request.query);
            if(!order){
                QuestionOrder.Model.find(function (error, questionOrders) {
                    if (error) response.send(error);
                    response.json({questionOrder: questionOrders});
                });
            }
            else{
                console.log('should go in here')
                QuestionOrder.Model.find({"form": order.form}, function (error, questionOrders) {
                    if (error) response.send(error);
                    response.json({questionOrder: questionOrders});
                });
            }
        });

router.route('/:questionOrder_id')
        .get(function (request, response) {
            QuestionOrder.Model.findById(request.params.questionOrder_id, function (error, questionOrder) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    response.json({questionOrder: questionOrder});
                }
            });
        })
        
        .put(function (request, response) {
            QuestionOrder.Model.findById(request.params.questionOrder_id, function (error, questionOrder) {
                if (error) {
                    response.send({error: error});
                }
                else {
                    
                    // update each attribute
                    questionOrder.question = request.body.questionOrder.question;
                    questionOrder.form = request.body.questionOrder.form;
                    questionOrder.order = request.body.questionOrder.order;
                    
                    questionOrder.save(function (error) {
                        if (error) {
                            response.send({error: error});
                        }
                        else {
                            response.json({questionOrder: questionOrder});
                        }
                    });
                }
            });
        })
        
        .delete(function (request, response) {
            QuestionOrder.Model.findByIdAndRemove(request.params.questionOrder_id, function (error, deleted) {
                if (!error) {
                    response.json({questionOrder: deleted});
                }
            });
        });
        
module.exports = router;
