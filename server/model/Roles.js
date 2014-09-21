
var _ = require("underscore");

var roles = {
    user: {
        name: 'ROLE_USER',
        value: -1000,
        beautifulName: 'user'
    },
    admin: {
        name: 'ROLE_ADMIN',
        value: -90,
        beautifulName: 'admin'
    },
    root: {
        name: 'ROLE_ROOT',
        value: 0,
        beautifulName: 'root'
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
