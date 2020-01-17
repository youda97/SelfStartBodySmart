var express = require('express');
var router = express.Router();
var Appointments = require('../models/Appointments');

router.route('/')
    .post( function (request, response) {
        var appointment = new Appointments.Model(request.body.appointment);
        appointment.save(function (error) {
            if (error) response.send(error);
            response.json({appointment: appointment});
        });
        
    })
    .get( function (request, response) {
        let patient = request.query.filter;
        if (!patient) {
            Appointments.Model.find(function (error, appointments) {
                if (error) response.send(error);
                response.json({appointment: appointments});
            });
        }
        else{
            Appointments.Model.find({"patient": patient.id}, function (error, appointments) {
                console.log(appointments);
                if (error) response.send(error);
                response.json({appointment: appointments});
            });
        }
    });

router.route('/:appointment_id')
    .get( function (request, response) {
        Appointments.Model.findById(request.params.appointment_id, function (error, appointment) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({appointment: appointment});
            }
        });
    })
    .put( function (request, response) {
        Appointments.Model.findById(request.params.appointment_id, function (error, appointment) {
            if (error) {
                response.send({error: error});
            }
            else {
                console.log(request.body);
                // update each attribute
                appointment.date = request.body.appointment.date;
                appointment.reason = request.body.appointment.reason;
                appointment.other = request.body.appointment.other;
                appointment.patient = request.body.appointment.patient;
                appointment.endDate = request.body.appointment.endDate;
                appointment.pName = request.body.appointment.pName;
                appointment.order = request.body.appointment.order;
                appointment.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({appointment: appointment});
                    }
                });
            }
        });
    })
    .delete( function (request, response) {
        Appointments.Model.findByIdAndRemove(request.params.appointment_id,
            function (error, deleted) {
                if (!error) {
                    response.json({appointment: deleted});
                }
            }
        );
    });

module.exports = router;