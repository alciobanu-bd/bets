
var restful = require('node-restful');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    salt: {type: 'string', required: false},
    role: {type: 'string', required: false},
    birthDate: {type: 'date', required: true},
    email: {type: 'string', required: true},
    registerDate: {type: 'date', required: false},
    points: {type: 'number', required: false},
    place: {type: 'number', required: false}
});

module.exports = restful.model('user', UserSchema);

/*
    Possible roles for user (from less privileged to most privileged):

    ROLE_USER
    ROLE_ADMIN
    ROLE_ROOT

 */
