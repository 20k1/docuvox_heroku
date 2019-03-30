var express = require('express');
var router = express.Router();
var Patient = require('../models/Patient');
var Medicine = require('../models/Medicine');
var CheckList = require('../models/CheckList');
var Vital = require('../models/Vital');

var selectedPatient;

router.post('/', function(req, res, next) {
    let df_request = req.body;
    console.log(df_request);
    let df_response = {
        "fulfillmentText": df_request.queryResult.fulfillmentText
    };
    let intent = df_request.queryResult.intent;
    let parameters = df_request.queryResult.parameters;
    switch (intent.name) {
         // Create Document
        case "projects/nurse-a5442/agent/intents/33ab5b5e-84c7-4501-8fc4-0a77bc45e55d":
            var first_name = parameters.first_name;
            var last_name = parameters.last_name;
            if (first_name !== undefined && first_name !== "" && last_name !== undefined && last_name !== "") {
                console.log(Patient);
                var patient = new Patient({
                    first_name: first_name,
                    last_name: last_name
                });
                console.log(patient);
                patient.save((err, patient) => {
                    if (err) return console.error(err);
                    selectedPatient = patient;
                    console.log("Created Document for Patient \"" + first_name + " " + last_name + "\" with patient number: " + patient.patient_number );
                    console.log(patient);
                });
            } else {
                var text_response = "Could not understand information about the patient.";
                df_response.fulfillmentText = text_response;
                console.log(text_response);
            }
            break;
        // Select Patient
        case "projects/nurse-a5442/agent/intents/64fbc502-f951-4182-a91b-68493d395b15":
            var first_name = parameters.first_name;
            var last_name = parameters.last_name;
            var patient_number = parameters.patient_number;
            if ( patient_number !== undefined && patient_number !== "") {
                Patient.findOne({patient_number: patient_number}, function(err, patient) {
                    if (err) return console.error(err);
                    selectedPatient = patient;
                    console.log("Selected Patient: " + selectedPatient);
                });
            } else if (first_name !== undefined && first_name !== "" && last_name !== undefined && last_name !== "") {
                console.log(Patient);
                Patient.findOne({first_name: first_name, last_name: last_name}, function(err, patient) {
                    if (err) return console.error(err);
                    selectedPatient = patient;
                    console.log("Selected Patient: " + selectedPatient);
                });
            } else {
                var text_response = "Could not understand information about the patient.";
                df_response.fulfillmentText = text_response;
                console.log(text_response);
            }
            break;
        // Deselect Patient
        case "projects/nurse-a5442/agent/intents/7d61919f-5e12-4821-bf71-c7d52c363f09":
            selectedPatient = undefined;
            break;
        // Medicine
        case "projects/nurse-a5442/agent/intents/4f82e94b-84e0-430f-9984-fb4812eb4288":
            if (selectedPatient !== undefined){
                var medicine_list = parameters.medicine_list;
                var date_time = parameters.date_time;
                var weight_list = parameters.weight_list;
                var volume_list = parameters.volume_list;
                if ( date_time === undefined || date_time === "" ) {
                    var d = new Date();
                    date_time = d.toJSON();
                }
                if ( date_time.startTime !== undefined ) {
                    date_time = date_time.startTime;
                }
                var time_slot = "";
                console.log(date_time);
                var temp_date = new Date(date_time);
                var hours = temp_date.getHours() + 2;
                console.log(hours);
                if ( hours < 8 ) {
                    // night
                    time_slot = "night";
                } else if ( hours < 12 ) {
                    // morning
                    time_slot = "morning";
                } else if ( hours < 16 ) {
                    // afternoon
                    time_slot = "afternoon";
                } else if ( hours < 24 ) {
                    // evening
                    time_slot = "evening";
                }
                console.log(JSON.stringify(medicine_list));
                console.log(JSON.stringify(date_time));
                console.log(JSON.stringify(weight_list));
                console.log(JSON.stringify(volume_list));

                if ( medicine_list === undefined || medicine_list.length <= 0 ) {
                    console.log("No Medicine List given.");
                    let text_response = "Could not understand information about medicines.";
                    df_response.fulfillmentText = text_response;
                    console.log(text_response);
                } else {
                    if ( weight_list !== undefined && weight_list.length > 0 ) {
                        medicine_list.forEach((medicine, i) => {
                            Medicine.findOne({medicine: medicine, patient_number: selectedPatient.patient_number, unit: weight_list[i].unit, amount: weight_list[i].amount, given: false, time_slot: time_slot}, function(err, db_medicine) {
                                if (err) return console.error(err);
                                if ( db_medicine !== null ){
                                    db_medicine.given = true;
                                    db_medicine.save((err, medicine) => {
                                        if (err) return console.error(err);
                                        console.log("Medicine Given: ");
                                        console.log(medicine);
                                    });
                                } else {
                                    let medicine_object = new Medicine({
                                        medicine: medicine,
                                        patient_number: selectedPatient.patient_number,
                                        unit: weight_list[i].unit,
                                        amount: weight_list[i].amount,
                                        given: true,
                                        time: date_time,
                                        time_slot: time_slot
                                    });
                                    medicine_object.save((err, medicine) => {
                                        if (err) return console.error(err);
                                        console.log("Created Document for Medicine:");
                                        console.log(medicine);
                                    });
                                }
                            });
                        });
                    }
                    else if ( volume_list !== undefined && volume_list.length > 0 ) {
                        medicine_list.forEach((medicine, i) => {
                            Medicine.findOne({medicine: medicine, patient_number: selectedPatient.patient_number, unit: weight_list[i].unit, amount: weight_list[i].amount, given: false, time_slot: time_slot}, function(err, db_medicine) {
                                if (err) return console.error(err);
                                if ( db_medicine !== null ){
                                    db_medicine.given = true;
                                    db_medicine.save((err, medicine) => {
                                        if (err) return console.error(err);
                                        console.log("Medicine Given: ");
                                        console.log(medicine);
                                    });
                                } else {
                                    let medicine_object = new Medicine({
                                        medicine: medicine,
                                        patient_number: selectedPatient.patient_number,
                                        unit: volume_list[i].unit,
                                        amount: volume_list[i].amount,
                                        given: true,
                                        time: date_time,
                                        time_slot: time_slot
                                    });
                                    medicine_object.save((err, medicine) => {
                                        if (err) return console.error(err);
                                        console.log("Created Document for Medicine:");
                                        console.log(medicine);
                                    });
                                }
                            });
                        });
                    } else {
                        var text_response = "Weight/Volume is not specified";
                        df_response.fulfillmentText = text_response;
                        console.log(text_response);
                    }
                }
            } else {
                var text_response = "No patient selected.";
                df_response.fulfillmentText = text_response;
                console.log(text_response);
            }
            break;
        // Check
        case "projects/nurse-a5442/agent/intents/40ace160-e414-4cd3-9156-8ac631fe483a":
            if (selectedPatient !== undefined) {
                var checklist = parameters.checklist;
                var date_time = parameters.date_time;
                if ( date_time === undefined || date_time === "" ) {
                    var d = new Date();
                    date_time = d.toJSON();
                }
                if ( date_time.startTime !== undefined ) {
                    date_time = date_time.startTime;

                }
                checklist.forEach((checklist_item, i) => {
                    CheckList.findOne({patient_number: selectedPatient.patient_number, item: checklist_item}, function(err, checklist_item) {
                        if (err) return console.error(err);
                        console.log(checklist_item);
                        if (checklist_item === null) {
                            let checklist_item_to_save = new CheckList({
                                item: checklist,
                                checked: true,
                                patient_number: selectedPatient.patient_number,
                                time: date_time
                            });
                            checklist_item_to_save.save((err, saved_checklist_item) => {
                                if (err) return console.error(err);
                                console.log("Checked: ");
                                console.log(saved_checklist_item);
                            });
                        } else {
                            checklist_item.checked = true;
                            checklist_item.save((err, saved_checklist_item) => {
                                if (err) return console.error(err);
                                console.log("Checked: ");
                                console.log(saved_checklist_item);
                            });
                        }
                    });
                });
            } else {
                var text_response = "No patient selected.";
                df_response.fulfillmentText = text_response;
                console.log(text_response);
            }
            break;
        // Vital
        case "projects/nurse-a5442/agent/intents/2c9dab91-65e7-4451-b2f0-94474e640297":
            if (selectedPatient !== undefined) {
                var vital = parameters.vital;
                var vital_value = parameters.vital_value;
                console.log(vital_value);
                console.log(vital_value.number);
                var date_time = parameters.date_time;
                if ( date_time === undefined || date_time === "" ) {
                    var d = new Date();
                    date_time = d.toJSON();
                }
                var vital_object = new Vital({
                    patient_number: selectedPatient.patient_number,
                    vital: vital,
                    vital_value: vital_value.number,
                    time: date_time,
                });
                vital_object.save((err, vital_object) => {
                    if (err) return console.error(err);
                    console.log("Created Document for Vital:");
                    console.log(vital_object);
                });
            } else {
                var text_response = "No patient selected.";
                df_response.fulfillmentText = text_response;
                console.log(text_response);
            }
            break;
        default:
            console.log(df_response);
    }
    res.send(df_response);
});

module.exports = router;
