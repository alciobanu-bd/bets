
var _ = require("underscore");

var roles = {
    user: {
        name: 'ROLE_USER',
        value: -1000,
        beautifulName: 'user',
        description: 'User is the one who keeps the community alive by guessing the scores every week.'
    },
    admin: {
        name: 'ROLE_ADMIN',
        value: -90,
        beautifulName: 'admin',
        description: 'The one who administrates the site, chooses matches, posts the results, ' +
            'assures that everything is working properly.'
    },
    root: {
        name: 'ROLE_ROOT',
        value: 0,
        beautifulName: 'root',
        description: 'Developer and founder of the application.'
    }
};

var roleValue = function (roleName) {
    var fRole = _.find(roles, function (role) {
        return role.name == roleName;
    });
    if (fRole) {
        return fRole.value;
    }
    return -999999999;
}

roles.roleValue = roleValue;

module.exports = roles;
