var express = require('express');
var router = express.Router();
var RehabClientLink = require('../models/RehabClientLink');

router.route('/')
    .post( function (request, response) {
        var rehabClientLink = new RehabClientLink.Model(request.body.rehabClientLink);
        console.log(request.body);
        rehabClientLink.save(function(error) {
            if(error) response.send(error);
            response.json({rehabClientLink: rehabClientLink});
        });
        //
        // RehabClientLink.addLinkByPatientAndPlan(rehabClientLink, (err, rehabClientLink) =>{
        //     if(err){
        //         response.json({success: false});
        //     } else {
        //         response.json({rehabClientLink: rehabClientLink});
        //     }
        //
        // })
        // rehabClientLink.save(function (error) {
        //     if (error) response.send(error);
        //     response.json({rehabClientLink: rehabClientLink});
        // });
    })
    .get( function (request, response) {
        var assign =  request.query.filter;
        if (!assign) {
            RehabClientLink.Model.find(function (error, rehabClientLinks) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({rehabClientLink: rehabClientLinks});
                }
            });
        }
        else if (assign.id){
            console.log('sdf');
            RehabClientLink.Model.find({"Patient": assign.id}, function (error, rehabClientLinks) {
                console.log("right place");
                if (error) {
                    response.send(error);
                } else {
                    response.json({rehabClientLink: rehabClientLinks});
                }
            });
        }
        else{
            if (assign.RehabilitationPlan && assign.Patient){
                console.log('qwertyuio');
                RehabClientLink.Model.find({"RehabilitationPlan": assign.RehabilitationPlan, "Patient": assign.Patient}, function (error, rehabClientLinks) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({rehabClientLink: rehabClientLinks});
                    }
                });
            }
            else {
                console.log('terminate');
                RehabClientLink.Model.find({"assessmentTest": assign.assessmentTest, "Patient": assign.Patient}, function (error, rehabClientLinks) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({rehabClientLink: rehabClientLinks});
                    }
                });
            }
        }
    });

router.route('/:rehabClientLink_id')
    .get( function (request, response) {
        RehabClientLink.Model.findById(request.params.rehabClientLink_id, function (error, rehabClientLinks) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({rehabClientLink: rehabClientLinks});
            }
        });
    })

    .put( function (request, response) {
        RehabClientLink.Model.findById(request.params.rehabClientLink_id, function (error, rehabClientLink) {
            if (error) {
                response.send({error: error});
            }
            else {

                // update each attribute
                rehabClientLink.RehabilitationPlan = request.body.rehabClientLink.RehabilitationPlan;
                rehabClientLink.Patient = request.body.rehabClientLink.Patient;
                rehabClientLink.terminated = request.body.rehabClientLink.terminated;
                rehabClientLink.assigned = request.body.rehabClientLink.assigned;
                rehabClientLink.assessmentTest = request.body.rehabClientLink.assessmentTest;

                rehabClientLink.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({rehabClientLink: rehabClientLink});
                    }
                });
            }
        });
    });

// .delete( function (request, response) {
//     RehabLinker.Model.findByIdAndRemove(request.params.rehabLinkers_id,
//         function (error, deleted) {
//             if (!error) {
//                 response.json({rehabLinker: deleted});
//             }
//         }
//     );
// });

module.exports = router;