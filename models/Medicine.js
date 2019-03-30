var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    medicine: { type: String , index: true },
    patient_number: { type: Number, index: true },
    unit: { type: String },
    amount: { type: Number },
    given: { type: Boolean},
    time_slot: {type: String},
    time: { type: String, index: true }
});

var Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;