var express = require('express');
var router = express.Router();
var ExerciseList = require('../models/ExerciseList');

router.route('/')
    .post( function (request, response) {
        var exerciseList = new ExerciseList.Model(request.body.exerciseList);
        exerciseList.save(function (error) {
            if (error) response.send(error);
            response.json({exerciseList: exerciseList});
        });
    })
    .get( function (request, response) {
        var list =  request.query.filter;
        if (!list){
            ExerciseList.Model.find(function (error, exerciseLists) {
                if (error) response.send(error);
                response.json({exerciseList: exerciseLists});
            });
        }
        else{
            ExerciseList.Model.find({"rehabilitationPlan": list.rehabilitationPlan}, function (error, exerciseLists) {
                if (error) response.send(error);
                response.json({exerciseList: exerciseLists});
            });
        }
    });

router.route('/:exerciseList_id')
    .get( function (request, response) {
        ExerciseList.Model.findById(request.params.exerciseList_id, function (error, exerciseList) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({exerciseList: exerciseList});
            }
        });
    })
    /// post vs put?
    .put( function (request, response) {
        ExerciseList.Model.findById(request.params.exerciseList_id, function (error, exerciseList) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                exerciseList.order = request.body.exerciseList.order;
                exerciseList.exercise = request.body.exerciseList.exercise;
                exerciseList.rehabilitationPlan = request.body.exerciseList.rehabilitationPlan;

                exerciseList.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({exerciseList: exerciseList});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        ExerciseList.Model.findByIdAndRemove(request.params.exerciseList_id,
            function (error, deleted) {
                if (!error) {
                    response.json({exerciseList: deleted});
                }
            }
        );
    });

module.exports = router;