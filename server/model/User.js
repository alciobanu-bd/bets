
var restful = require('node-restful');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    birthDate: {type: 'date', required: true},
    email: {type: 'string', required: true},
    registerDate: {type: 'date', required: false},
    points: {type: 'number', required: false},
    place: {type: 'number', required: false}
});

module.exports = restful.model('user', UserSchema);
