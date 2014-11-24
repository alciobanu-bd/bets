
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
    avgPoints: {type: 'number', required: false},
    place: {type: 'number', required: false},
    registrationIp: {type:'string', required: false},
    serverSalt: {type:'string', required: false},
    active: {type: Boolean, required: false},
    disabled: {type: Boolean, required: false},
    isMailNotificationOn: {type: Boolean, required: false},
    lastLogin: {type: 'date', required: false},
    wonWeeks: {type: 'number', required: false},
    language: {type: 'string', required: false}
});

UserSchema.path('username').validate(function (v) {
    return v.length < 21;
}, 'too_long|20');

UserSchema.path('email').validate(function (v) {
    return v.length < 41;
}, 'too_long|40');

UserSchema.path('email').validate(function (v) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(v);
}, 'not_valid');


UserSchema.path('birthDate').validate(function (v) {
    return new Date() - new Date(v) > 16 * 365 * 24 * 60 * 60 * 1000; // 16 years
}, 'too_young');

module.exports = restful.model('user', UserSchema);
