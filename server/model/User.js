
var restful = require('node-restful');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    salt: {type: 'string', required: true},
    role: {type: 'string', required: false},
    birthDate: {type: 'date', required: true},
    email: {type: 'string', required: true},
    registerDate: {type: 'date', required: false},
    points: {type: 'number', required: false},
    place: {type: 'number', required: false},
    registrationIp: {type:'string', required: false},
    serverSalt: {type:'string', required: false},
    active: {type: Boolean, required: false},
    disabled: {type: Boolean, required: false}
});

UserSchema.path('username').validate(function (v) {
    return v.length < 21;
}, 'Username can\'t have more than 20 characters.');

UserSchema.path('email').validate(function (v) {
    return v.length < 41;
}, 'E-mail can\'t have more than 40 characters.');

UserSchema.path('email').validate(function (v) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(v);
}, 'E-mail address is not valid. Please provide a correct e-mail address.');


UserSchema.path('birthDate').validate(function (v) {
    return new Date() - new Date(v) > 16 * 365 * 24 * 60 * 60 * 1000; // 16 years
}, 'You are too young. Grow up a little and get back.');

module.exports = restful.model('user', UserSchema);
