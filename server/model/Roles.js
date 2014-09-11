
var _ = require("underscore");

var roles = {
    user: {
        name: 'ROLE_USER',
        value: -1000
    },
    admin: {
        name: 'ROLE_ADMIN',
        value: -90
    },
    root: {
        name: 'ROLE_ROOT',
        value: 0
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
