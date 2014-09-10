
// NOTE that app is defined globally

var initFeed = {
    user: {
        address: "/api/user"
    },
    auth: {
        login: "api/auth/login",
        salt: "api/auth/salt"
    }
};

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json(initFeed);
});

app.use('/api', router);
