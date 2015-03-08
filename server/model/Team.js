
var mongoose = require('mongoose');

var TeamSchema = mongoose.Schema({
    name: {type: Array, required: true}, // should be an array of name for every language in the site
    details: {type: Array, required: false},
    nicknames: {type: Array, required: false},
    countryCode: {type: 'string', required: true},
    founded: {type: 'number', required: true},
    imageUrl: {type: 'string', required: true},
    city: {type: Array, required: true}
});

module.exports = mongoose.model('team', TeamSchema);
