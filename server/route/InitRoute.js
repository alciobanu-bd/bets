
// NOTE that app is defined globally

var initFeed = {
    user: {
        address: "/api/user",
        roles: "/api/roles",
        ranking: "/api/ranking",
        activate: "/api/user/activate",
        details: "/api/user/details",
        resendRegistrationCode: "/api/user/resend_regcode",
        activateAsAdmin: "/api/user/activateAsAdmin"
    },
    auth: {
        login: "/api/auth/login",
        salt: "/api/auth/salt",
        extendToken: "/api/auth/extend_expiration_token"
    },
    week: {
        address: "/api/week",
        current: "/api/week/last",
        beforeLast: "/api/week/beforeLast",
        getByNumber: '/api/week/getByNumber'
    },
    bet: {
        address: "/api/bet",
        byWeek: "/api/bets/getBetByWeek",
        history: "/api/bet/history"
    },
    admin: {
        rankingRecalculate: "/api/ranking/recalculate"
    }
};

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.status(200).json(initFeed).end();
});

app.use('/api', router);
