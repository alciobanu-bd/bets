
// NOTE that app is defined globally

var Bet = require('./../model/Bet.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var setUserId =
function(req, res, next, user) {
    // set userId
    req.body.username = user.username;
    req.body.userId = user._id;
    next();
}

Bet
.methods(['get', 'post', 'put', 'delete'])

.before('post',
function(req, res, next) {

    req.body.points = 0;
    req.body.ended = false;
    req.body.status = 'BET_STATUS_ACTIVE';
    next();

})

.before('post', jwtauth([setUserId]))
.before('put', jwtauth([setUserId]))

.before('get', jwtauth([tokenChecks.hasRole('ROLE_USER')]))
.before('post', jwtauth([tokenChecks.hasRole('ROLE_USER')]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_USER')]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

;

Bet.register(app, '/api/bet');
