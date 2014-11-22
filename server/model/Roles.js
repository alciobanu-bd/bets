
var _ = require("underscore");

var descriptionTranslations = {
    en: {
        user: 'User is the one who keeps the community alive by guessing the scores every week.',
        admin: 'The one who administrates the site, chooses matches, posts the results, ' +
            'assures that everything is working properly.',
        root: 'Developer and founder of the application.'
    },
    ro: {
        user: 'Utilizatorul este cel care menține comunitatea în viață ghicind scorurile fiecărei etape.',
        admin: 'Administrează site-ul, alege meciuri, actualizează rezultatele, ' +
            'se asigură că totul funcționează optim.',
        root: 'Fondator al aplicației.'
    }
}

var roles = function (lang) {
    return {
        user: {
            name: 'ROLE_USER',
            value: -1000,
            beautifulName: 'user',
            description: descriptionTranslations[lang].user
        },
        admin: {
            name: 'ROLE_ADMIN',
            value: -90,
            beautifulName: 'admin',
            description: descriptionTranslations[lang].admin
        },
        root: {
            name: 'ROLE_ROOT',
            value: 0,
            beautifulName: 'root',
            description: descriptionTranslations[lang].root
        },
        roleValue: function (roleName) {
            var fRole = _.find(this, function (role) {
                return role.name == roleName;
            });
            if (fRole) {
                return fRole.value;
            }
            return -999999999;
        }
    };
}

module.exports = roles;
