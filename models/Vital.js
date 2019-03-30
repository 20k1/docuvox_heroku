var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vitalSchema = new Schema({
    patient_number: {type: Number, index: true},
    vital: { type: String , index: true },
    vital_value: { type: [Number], index: true },
    time: { type: String, index: true }
});

var Vital = mongoose.model('Vital', vitalSchema);

module.exports = Vital;