
var restful = require('node-restful');
var mongoose = require('mongoose');

var WeekSchema = mongoose.Schema({
    number: {type: 'number', required: true},
    events: {type: Array, required: true},
    locked: {type: Boolean, required: false},
    endDate: {type: Date, required: false},
    required: {type: 'number', required: true},
    resultsReady: {type: Boolean, required: false}
});

module.exports = restful.model('week', WeekSchema);
