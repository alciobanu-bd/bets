
// NOTE that app is defined globally

var express = require('express');

var Bet = require('./../model/Bet.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var weekChecks = require('./../middlewares/weekChecksForBets.js');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var setUserId = function(req, res, next, user, onError, onSuccess) {
    // set userId
    req.body.userId = user._id;
    req.body.username = user.username;
    onSuccess();

}

var router = express.Router();

router.get('/',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    Bet.find({}, function (err, bets) {
        if (err) {
            res.status(500).json({
                message: "Oops. Bets couldn't be fetched from the database."
            }).end();
        }
        else {
            res.status(200).json(bets).end();
        }
    });

});

router.get('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res, next) {

    Bet.findOne({_id: req.params.id}, function (err, bet) {
        if (err) {
            res.status(500).json({
                message: "Oops. Bet couldn't bet fetched from the database."
            }).end();
        }
        else {
            res.status(200).json(bet).end();
        }
    });

});

router.post('/',
jwtauth([tokenChecks.hasRole('ROLE_USER'), setUserId]),
weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]),

function (req, res, next) {
    // check if bet was already placed

    Bet.findOne({userId: req.body.userId, weekNumber: req.body.weekNumber},
        function (err, bet) {
            if (err) {
                res.status(500).json({
                    message: 'An error has occurred. You cannot place a bet for the moment.'
                }).end();
            }
            else if (bet) {
                res.status(500).json({
                    message: 'It seems that you already placed a bet this week and you try to place it again.'
                }).end();
            }
            else {
                next();
            }
        });

},

function (req, res, next) {

    var bet = new Bet();

    bet.points = 0;
    bet.ended = false;

    for (var i in req.body) {
        bet[i] = req.body[i];
    }

    bet.save(function (err) {
        if (err) {
            res.status(500).json({
                message: "An error occurred while trying to save bet."
            }).end();
        }
        else {
            res.status(201).json(bet).end();
        }
    });

});

router.put('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
weekChecks.weekMiddleware([weekChecks.callbacks.checkIfWeekEnded, weekChecks.callbacks.checkIfCorrectNumberOfMatches]),

function (req, res, next) {

    Bet.findOne({_id: req.params.id}, function (err, bet) {
        if (err) {
            res.status(500).json({
                message: "Oops. Couldn't save the bet to database."
            }).end();
        }
        else {

            // check if user who's trying to save bet is the one who posted the bet
            if (res.data.local.user._id != bet.userId) {
                res.status(500).json({
                    message: "You are not permitted to save another user's bet."
                }).end();
            }
            else {
                bet.points = 0; // you cannot save the bet after points are calculated, so there is no risk to overwrite results
                bet.ended = false; // the same, no risk that bet ended and you save as not ended

                bet.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            message: "Oops. The bet couldn't be saved."
                        }).end();
                    }
                    else {
                        res.status(200).json(bet).end();
                    }
                });

            }

        }
    });

});

app.use('/api/bet', router);
