
/*
Paths start with app and not with client/app.
client is root /
Bow before client for it is root.
 */

var templates =
{
    header: {
        logged: {
            html: 'app/user/views/headerLogged.html',
            route: ''
        },
        notLogged: {
            html: 'app/user/views/headerNotLogged.html',
            route: ''
        }
    },
    user: {
        login: {
            html: 'app/user/views/login.html',
            route: 'login'
        },
        register: {
            html: 'app/user/views/register.html',
            route: 'register'
        }
    },
    welcome: {
        logged: {
            html: 'app/main/views/welcomeLogged.html',
            route: ''
        },
        notLogged: {
            html: 'app/main/views/welcomeNotLogged.html',
            route: ''
        }
    },
    ranking: {
        html: 'app/ranking/views/ranking.html',
        route: 'ranking'
    }
}

templatesModule.provider('Templates', function () {
    return {
        $get: function () {
            return templates;
        }
    };
});
