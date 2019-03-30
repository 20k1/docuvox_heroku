var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patient_number: { type: Number, index: true },
    first_name: { type: String, index: true },
    last_name: { type: String, index: true }
});

patientSchema.plugin(autoIncrement.plugin, { model: 'Patient', field: 'patient_number' });

var Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;