
/*
Paths start with app and not with client/app.
client is root /
Bow before client for it is root.
 */

var templates =
{
    header: {
        logged: 'app/user/views/headerLogged.html',
        notLogged: 'app/user/views/headerNotLogged.html'
    },
    user: {
        login: 'app/user/views/login.html',
        register: 'app/user/views/register.html'
    }
}

templatesModule.provider('Templates', function () {
    return {
        $get: function () {
            return templates;
        }
    };
});
