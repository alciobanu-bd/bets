
var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var Settings = require('./config/Settings.js');

GLOBAL.app = express();
GLOBAL.domainName = Settings.domainName;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.use(multer({ dest: './uploads/'}));

app.use(function (req, res, next) {
    // url decoding middleware
    req.url = req.url
        .replace(/\&/gi, '%26')
        .replace(/=/gi, '%3D')
        .replace(/\+/gi, '%2B')
        .replace(/@/gi, '%40')
        .replace(/:/gi, '%3A')
        .replace(/\$/g, '%24')
        .replace(/,/gi, '%2C');
    try {
        req.url = decodeURIComponent(req.url);
    }
    catch (err) {
        res.status(500).json({
            message: "Cannot decode address. " + req.url
        }).end();
        console.log(req.url);
    }
    req.url = req.url.replace(/[/]+/g, '/');
    next();
});

/*
 * Sees if requests have language. If not, is sets english as default.
 */
app.use(function (req, res, next) {
    if (!req.query.lang && req.url.indexOf('.html') < 0) {
        req.query.lang = 'en';
    }
    next();
});

// gc once in a while
setInterval(function () {
    global.gc();
}, 10 * 60 * 1000); // 10 minutes

// use token service
var filename = "server/config/secretString";
var secretString = fs.readFileSync(filename, "utf8");
app.set('jwtTokenSecret', secretString);

mongoose.connect(Settings.dbPath);

db = mongoose.connection;
db
    .on('error', function (err) {
        console.error('DB connection error.');
        throw err;
    })
    .once('open', function() {
        console.log('DB Connection established.');
    });

var mkdirp = require('mkdirp');
mkdirp('logs');
mkdirp('uploads');

/*
 * Mail setup
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

GLOBAL.mailTransporter = nodemailer.createTransport(smtpTransport({
    host: Settings.mail.smtp.host,
    port: Settings.mail.smtp.port
}));

mailTransporter.use('stream', require('nodemailer-dkim').signer({
    domainName: Settings.domainName.dns,
    keySelector: 'default',
    privateKey: fs.readFileSync('server/config/privatekey.txt')
}));

var verifyKeys = require('nodemailer-dkim').verifyKeys;
verifyKeys({
    domainName: Settings.domainName.dns,
    keySelector: 'default',
    privateKey: fs.readFileSync('server/config/privatekey.txt')
}, function(err, success){
    if(err){
        console.log('DKIM verification failed');
        console.log(err);
    }else if(success){
        console.log('DKIM verification successful, keys match');
    }
});

// resolve statics
// use client folder as root path /
app.use('/', express.static(path.resolve('client/')));

app.get('/api/serverDate', function (req, res) {
    res.status(200).json({
        date: new Date()
    }).end();
});

// START THE SERVER
GLOBAL.LISTENER = app.listen(Settings.port);
console.log('Server started on port ' + Settings.port);

require('./sockets/SocketConnection.js');

require('./route/InitRoute.js');
require('./model/User.js');
require('./route/UserRoute.js');
require('./route/LoginRoute.js');
require('./route/RolesRoute.js');
require('./route/RankingRoute.js');
require('./route/WeekRoute.js');
require('./route/BetRoute.js');
require('./route/BetsPerWeek.js');
require('./route/BetHistoryRoute.js');
require('./route/UserLocationRoute.js');
require('./route/TeamRoute.js');

require('./services/CronJobs.js');
