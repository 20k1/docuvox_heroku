var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    patient_number: {type: Number, index: true},
    text: { type: String , index: true },
    time: { type: String, index: true }
});

var Report = mongoose.model('Report', reportSchema);

module.exports = Report;
