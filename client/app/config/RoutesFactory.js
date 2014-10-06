
configModule

.factory('RoutesFactory', [
'UserInformation', 'Templates', '$location', '$routeParams',
function (UserInformation, Templates, $location, $routeParams) {

    var thisFactory = {};

    thisFactory.goHome = function () {
        if (UserInformation.isLogged) {
            thisFactory.currentBodyView = Templates.welcome.logged;
        }
        else {
            thisFactory.currentBodyView = Templates.welcome.notLogged;
        }
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToLogin = function () {
        if (UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        thisFactory.currentBodyView = Templates.user.login;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToRegister = function () {
        if (UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        thisFactory.currentBodyView = Templates.user.register;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToRanking = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.ranking;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToWeek = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.week;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToProfile = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.account.profile;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToHistory = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.bet.history;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToActivation = function () {
        if (!UserInformation.isLogged || (UserInformation.isLogged && UserInformation.user.active)) {
            thisFactory.goHome();
            return;
        }
        thisFactory.currentBodyView = Templates.activation;
        $location.path(Templates.activation.route);
    }

    thisFactory.goToAdminPanel = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.admin;
        $location.path(Templates.admin.route);
    }

    thisFactory.goToRules = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.rules;
        $location.path(Templates.rules.route);
    }

    thisFactory.goToChangePassword = function () {
        if (!UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        if (UserInformation.isLogged && !UserInformation.user.active) {
            thisFactory.goToActivation();
            return;
        }
        thisFactory.currentBodyView = Templates.user.changePassword;
        $location.path(Templates.user.changePassword.route);
    }

    thisFactory.mappings = [
        {
            mainRoute: [''],
            fn: thisFactory.goHome
        },
        {
            mainRoute: ['login'],
            fn: thisFactory.goToLogin
        },
        {
            mainRoute: ['register'],
            fn: thisFactory.goToRegister
        },
        {
            mainRoute: ['ranking'],
            fn: thisFactory.goToRanking
        },
        {
            mainRoute: ['profile'],
            fn: thisFactory.goToProfile
        },
        {
            mainRoute: ['activation'],
            fn: thisFactory.goToActivation
        },
        {
            mainRoute: ['week'],
            fn: thisFactory.goToWeek
        },
        {
            mainRoute: ['history'],
            fn: thisFactory.goToHistory
        },
        {
            mainRoute: ['admin'],
            fn: thisFactory.goToAdminPanel
        },
        {
            mainRoute: ['rules'],
            fn: thisFactory.goToRules
        },
        {
            mainRoute: ['change-password'],
            fn: thisFactory.goToChangePassword
        }
    ];

    thisFactory.loadDefault = function () {
        for (var i = 0; i < thisFactory.mappings.length; i++) {
            var route = thisFactory.mappings[i];
            for (var j = 0; j < route.mainRoute.length; j++) {
                if ("/" + route.mainRoute[j] == $location.path()) {
                    route.fn();
                    return;
                }
            }
        }
        thisFactory.goHome();
    }

    return thisFactory;

}]);
