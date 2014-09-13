
// NOTE that app is defined globally

var initFeed = {
    user: {
        address: "/api/user",
        roles: "/api/roles",
        ranking: "/api/ranking"
    },
    auth: {
        login: "/api/auth/login",
        salt: "/api/auth/salt"
    }
};

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json(initFeed).end();
});

app.use('/api', router);
