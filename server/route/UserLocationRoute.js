
var UserLocation = require('./../model/UserLocation.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var express = require('express');
var router = express.Router();


router.get('/get/:id([0-9a-fA-F]{24})',
jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]),
function (req, res, next) {
    // page is indexed from 0 -- zero is the first page

    var pageSize = req.query.pageSize;
    var page = req.query.page;

    var userId = req.params.id;

    if (!userId) {
        res.status(401).json({
            message: "NO_USER_SPECIFIED"
        }).end();
        return;
    }

    UserLocation.count({userId: userId}, function (err, count) {
        if (err) {
            res.status(500).json({
                message: "DB_ERR"
            }).end();
        }
        else {
            UserLocation.find({userId: userId},
                {__v: 0},
                {sort: {date: -1}, skip: pageSize * page, limit: pageSize},
                function (err, locations) {
                    if (err) {
                        res.status(500).json({
                            message: "DB_ERR"
                        }).end();
                    }
                    else {
                        res.status(200).json({
                            locations: locations,
                            count: count,
                            numberOfPages: Math.ceil(count / pageSize),
                            itemsPerPage: pageSize
                        }).end();
                    }
                });
        }
    });


});

app.use('/api/userLocations', router);

