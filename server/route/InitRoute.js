
// NOTE that app is defined globally

var initFeed = {
    user: {
        address: "/api/user"
    }
};

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.json(initFeed);
});

app.use('/api', router);
