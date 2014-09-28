
// NOTE that app is defined globally

var User = require('./../model/User.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var pointsManagementFunctions = require('./../middlewares/pointsManagement.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var express = require('express');

var router = express.Router();

router.get('/ranking', jwtauth([tokenChecks.hasRole('ROLE_USER')]), function(req, res) {

    User.find({},
    {password: 0, salt: 0, serverSalt: 0, _v: 0, email: 0, birthDate: 0, registrationIp: 0},
    {sort: {points: -1}}, // sort by points descending
    function (err, users) {

        if (err) {
            res.json({message: "An error has occurred."}).end();
        }

        else {
            res.json(users).end();
        }

    }
    );

});

router.get('/ranking/recalculate',
    jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
    pointsManagementFunctions.updatePointsForBets,
    pointsManagementFunctions.updatePointsForUsers,
    pointsManagementFunctions.updateUsersPlace
);

app.use('/api', router);

