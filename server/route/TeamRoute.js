
// NOTE that app is defined globally

var Team = require('./../model/Team.js');

var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var Translations = require('./../config/Translations.js');

var express = require('express');
var router = express.Router();

router.get('/',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res) {

    Team.find({}, function (err, teams) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.cannotFetchTeams
            }).end();
        }
        else {
            res.status(200).json(teams).end();
        }
    });

});

router.get('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res) {

    Team.findOne({_id: req.params.id}, function (err, team) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.cannotFetchTeam
            }).end();
        }
        else {
            res.status(200).json(team).end();
        }
    });

});

router.get('/getByName/:name',
jwtauth([tokenChecks.hasRole('ROLE_USER')]),
function (req, res) {

    var nameParam = req.params.name;

    if (!nameParam) {
        res.status(500).json({
            message: Translations[req.query.lang].teamRoute.noNameSent
        }).end();
        return;
    }

    nameParam = nameParam.trim();

    Team.find({"name.value": new RegExp(nameParam, "i")}, function (err, teams) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.cannotFetchTeam
            }).end();
        }
        else {
            res.status(200).json(teams).end();
        }
    });

});


router.post('/',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    var team = new Team();
    for (var i in req.body) {
        team[i] = req.body[i];
    }

    team.save(function (err) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.savingError
            }).end();
            return;
        }

        res.status(200).json(team).end();

    });

});

router.put('/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {

    var onError = function () {
        res.status(500).json({
            message: Translations[req.query.lang].teamRoute.savingError
        }).end();
    }

    Team.findOne({_id: req.params.id},
    function (err, team) {
        if (err) {
            onError();
            return;
        }

        for (var i in req.body) {
            team[i] = req.body[i];
        }

        team.save(function (err) {
            if (err) {
                onError();
                return;
            }

            res.status(200).json(team).end();

        });

    });

});

app.use('/api/team', router);

