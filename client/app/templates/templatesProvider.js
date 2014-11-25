
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
        },
        languageDropdown: '/app/user/views/languageDropdown.html'
    },
    user: {
        login: {
            html: 'app/user/views/login.html',
            route: 'login'
        },
        register: {
            html: 'app/user/views/register.html',
            route: 'register'
        },
        changePassword: {
            html: 'app/user/views/changePassword.html',
            route: 'change-password'
        },
        forgotPassword: {
            html: 'app/user/views/forgotPassword.html',
            route: 'forgot-password'
        },
        resetPassword: {
            html: 'app/user/views/resetPassword.html',
            route: 'reset-password'
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
    },
    week: {
        html: 'app/week/views/week.html',
        route: 'week'
    },
    history: {
        html: 'app/history/views/history.html',
        route: 'history'
    },
    account: {
        activation: {
            html: 'app/user/views/activation.html',
            route: 'activation'
        },
        profile: {
            html: 'app/profile/views/profile.html',
            route: 'profile'
        }
    },
    bet: {
        history: {
            html: 'app/history/views/history.html',
            route: 'history'
        }
    },
    admin: {
        html: 'app/admin/views/adminPanel.html',
        route: 'admin'
    },
    rules: {
        html: 'app/rules/views/rules.html',
        route: 'rules'
    }
}

templatesModule.provider('Templates', function () {
    return {
        $get: function () {
            return templates;
        }
    };
});
