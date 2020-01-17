var express = require('express');
var router = express.Router();
var AskAPhysio = require('../models/AskAPhysio');

router.route('/')
    .post( function (request, response) {
        var askPhysio = new AskAPhysio.Model(request.body.askPhysio);
        askPhysio.save(function (error) {
            if (error) response.send(error);
            response.json({askPhysio: askPhysio});
        });
    })
    .get( function (request, response) {
        AskAPhysio.Model.find(function (error, askPhysios) {
            if (error) response.send(error);
            response.json({askPhysio: askPhysios});
        });
    });

router.route('/:askPhysio_id')
    .get( function (request, response) {
        AskAPhysio.Model.findById(request.params.askPhysio_id, function (error, askPhysio) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({askPhysio: askPhysio});
            }
        });
    })
    .put( function (request, response) {
        AskAPhysio.Model.findById(request.params.askPhysio_id, function (error, askPhysio) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                askPhysio.firstName = request.body.askPhysio.time;
                askPhysio.lastName = request.body.askPhysio.lastName;
                askPhysio.email = request.body.askPhysio.email;
                askPhysio.comment = request.body.askPhysio.comment;


                //SHOULD WE ADD FORM HERE?
                askPhysio.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({askPhysio: askPhysio});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        AskAPhysio.Model.findByIdAndRemove(request.params.askPhysio_id,
            function (error, deleted) {
                if (!error) {
                    response.json({askPhysio: deleted});
                }
            }
        );
    });



module.exports = router;