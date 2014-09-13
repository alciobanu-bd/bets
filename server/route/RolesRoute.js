
// NOTE that app is defined globally

var Roles = require('./../model/Roles.js');

var express = require('express');

var router = express.Router();

router.get('/roles', function(req, res) {
    res.status(200).json(Roles).end();
});

app.use('/api', router);
