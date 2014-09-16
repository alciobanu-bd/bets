
// NOTE that app is defined globally

var Bet = require('./../model/Bet.js');
var BetStatus = require('./../model/BetStatus.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

function setUserId (req, res, next, user) {
    // set userId
    req.body.userId = user._id;
}

Bet
.methods(['get', 'post', 'put', 'delete'])

.before('post',
function(req, res, next) {

    req.body.points = 0;
    req.body.ended = false;
    req.body.status = BetStatus.active;

    next();

})

.before('get', jwtauth([tokenChecks.hasRole('ROLE_USER')]))
.before('post', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('put', jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]))
.before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))

;

Bet.register(app, '/api/bet');
