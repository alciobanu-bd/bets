
// NOTE that app is defined globally

var Team = require('./../model/Team.js');

var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');
var Translations = require('./../config/Translations.js');

var Settings = require('./../config/Settings.js');

var express = require('express');
var router = express.Router();

var sizeOf = require('image-size');
var fs = require('fs');

var mkdirp = require('mkdirp');
mkdirp(Settings.team.logoPath.prefix + Settings.team.logoPath.dir);

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

router.post('/upload-logo', function (req, res) {

    var file = req.files ? req.files.file : null;

    if (!file) {
        res.status(500).json({
            message: Translations[req.query.lang].teamRoute.noFileInReq
        }).end();
        return;
    }

    if (!(file.extension.toLowerCase() == 'png') && file.mimetype != 'image/png') {
        fs.unlink(file.path);
        res.status(500).json({
            message: Translations[req.query.lang].teamRoute.pngOnly
        }).end();
        return;
    }

    sizeOf(file.path, function (err, dimensions) {
        if (err) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.errReadingImage
            }).end();
            return;
        }

        if (dimensions.width < Settings.team.minImageSize || dimensions.width > Settings.team.maxImageSize ||
            dimensions.height < Settings.team.minImageSize || dimensions.height > Settings.team.maxImageSize) {
            res.status(500).json({
                message: Translations[req.query.lang].teamRoute.logoAtLeast + Settings.team.minImageSize + "x" + Settings.team.minImageSize +
                Translations[req.query.lang].teamRoute.andNoMoreThan + Settings.team.maxImageSize + "x" + Settings.team.maxImageSize
            }).end();
            return;
        }

        var newName = new Date().toISOString().replace(/1/g, "0").replace(/2/g, "e").replace(/3/g, "c").replace(/4/g, "5")
            .replace(/5/g, "x").replace(/6/g, "1").replace(/7/g, "f").replace(/8/g, "w").replace(/9/g, "h").replace(/0/g, "X")
            .replace(/:/g, "").replace(/-/g, "").replace(/\./g, "").replace(/Z/g, "").replace(/T/g, "");
        var newPath = Settings.team.logoPath.prefix + Settings.team.logoPath.dir + newName + ".png";

        fs.rename(file.path, newPath);

        res.status(200).json({
            path: Settings.team.logoPath.dir + newName + ".png"
        }).end();

    });

});


app.use('/api/team', router);

