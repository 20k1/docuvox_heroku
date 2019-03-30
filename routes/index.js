var express = require('express');
var router = express.Router();
var Patient = require('../models/Patient');
var CheckList = require('../models/CheckList');
var Vital = require('../models/Vital');
var Medicine = require('../models/Medicine');

router.get('/patients', function(req, res, next) {
    Patient.find({}, function(err, db_patient_list) {
        if (err) return console.log(err);
        var result = [];
        for ( var i = 0 ; i < db_patient_list.length ; i++) {
            let patient = db_patient_list[i];
            let pat = {
                patient_number: patient.patient_number,
                first_name: patient.first_name,
                last_name: patient.last_name,
            };
            CheckList.find({patient_number: patient.patient_number}, function(err, db_checklist) {
                if (err) return console.log(err);
                if ( db_checklist !== null && db_checklist.length > 0) {
                    pat.checklist = db_checklist;
                }
                Vital.find({patient_number: patient.patient_number}, function(err, db_vitals) {
                    if (err) return console.log(err);
                    if ( db_vitals !== null && db_vitals.length > 0){
                        pat.vitals = db_vitals;
                    }
                    Medicine.find({patient_number: patient.patient_number}, function(err, db_medicines) {
                        if (err) return console.log(err);
                        if ( db_medicines !== null && db_medicines.length > 0) {
                            let medicines = [];
                            for (let index in db_medicines) {
                                let medicine = db_medicines[index];
                                let meds = medicines.filter(med => { return med.medicine == medicine.medicine && med.patient_number == medicine.patient_number && med.unit == medicine.unit && med.amount == medicine.amount})
                                console.log(meds);
                                if ( meds.length === 0){
                                    let med = {
                                        medicine: medicine.medicine,
                                        patient_number: medicine.patient_number,
                                        unit: medicine.unit,
                                        amount: medicine.amount,
                                        time_slot: {},
                                    };
                                    med.time_slot[medicine.time_slot] = medicine.given;
                                    medicines.push(med);
                                } else {
                                    let med = meds[0];
                                    if ( med.time_slot[medicine.time_slot] === medicine.given ) {

                                    }
                                    med.time_slot[medicine.time_slot] = medicine.given;
                                }
                            }
                            pat.medicines = medicines;
                        }
                        result.push(pat);
                        if ( result.length === db_patient_list.length) {
                            // console.log(result);
                            res.send(result);
                        }
                    });
                });
            });
        }
        db_patient_list.forEach(function(patient, i) {

        });
    });
});

router.get('/patient/:patient_number', function(req, res, next) {
    console.log(req.params.patient_number);
    Patient.find({patient_number: req.params.patient_number}, function(err, db_patient) {
        var patient = db_patient;
        CheckList.find({patient_number: patient.patient_number}, function(err, db_checklist) {
            if (err)
            patient.checklist = db_checklist;

        });

        console.log(db_res);
        res.send(db_res);
    });
});

module.exports = router;
