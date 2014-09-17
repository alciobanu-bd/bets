
// NOTE that app is defined globally

var Test = require('./../model/Test.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

var express = require('express');

var router = express.Router();

router.get('/test', jwtauth([
function (req, res, next, user, onError) {
    console.log("first middle");
    res.status(400).json({first: 1}).end();
    onError();
}, function (req, res, next, user, onError) {
    console.log("second middle");
//    res.status(500).json({second: 2}).end();
}]), function(req, res, next) {

    console.log("main");

/*    var test = new Test();
    test.name = 'ffff';
    test.save(function (err) {
        console.log("error", err);
    });*/
    res.status(200).json({third: 3}).end();

});

app.use('/api', router);

