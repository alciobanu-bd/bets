var express = require('express');
var jwt = require('express-jwt');
var bodyParser = require('body-parser');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var methodOverride = require('method-override');
GLOBAL.app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());
app.use(methodOverride());

mongoose.connect("mongodb://localhost/bets");

db = mongoose.connection;
db
    .on('error', function () {console.error('DB connection error.')})
    .once('open', function() {console.log('DB Connection established.')});

var port = 8080;

var user = require('./model/User.js');
var user = require('./route/UserRoute.js');

// START THE SERVER
app.listen(port);
console.log('Server started on port ' + port);

/*
app.set('jwtTokenSecret', 'YOUR_SECRET_STRING');

var expires = moment().add('days', 7).valueOf();
var token = jwt.encode({
    iss: user.id,
    exp: expires
}, app.get('jwtTokenSecret'));

res.json({
    token : token,
    expires: expires,
    user: user.toJSON()
});
*/

