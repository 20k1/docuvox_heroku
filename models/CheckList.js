var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkListSchema = new Schema({
    item: { type: String , index: true },
    checked: { type: Boolean, index: true },
    patient_number: { type: Number, index: true},
    time: { type: String, index: true }
});

var CheckList = mongoose.model('CheckList', checkListSchema);

module.exports = CheckList;