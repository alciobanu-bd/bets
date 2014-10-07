
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

    thisFactory.goToForgotPassword = function () {
        if (UserInformation.isLogged) {
            thisFactory.goHome();
            return;
        }
        thisFactory.currentBodyView = Templates.user.forgotPassword;
        $location.path(Templates.user.forgotPassword.route);
    }

    thisFactory.goToResetPassword = function () {
        if (UserInformation.isLogged) {
            UserInformation.isLogged = false;
        }
        thisFactory.currentBodyView = Templates.user.resetPassword;
        var route = Templates.user.resetPassword.route;
        var params = thisFactory.getParams();
        if (params[1]) {
            route += "/" + params[1];
        }
        $location.path(route);
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
        },
        {
            mainRoute: ['forgot-password'],
            fn: thisFactory.goToForgotPassword
        },
        {
            mainRoute: ['reset-password'],
            fn: thisFactory.goToResetPassword
        }
    ];

    thisFactory.loadDefault = function () {
        var splitPath = $location.path().split("/");
        if (splitPath.length > 1) {
            splitPath.splice(0, 1);
        }
        for (var i = 0; i < thisFactory.mappings.length; i++) {
            var route = thisFactory.mappings[i];
            for (var j = 0; j < route.mainRoute.length; j++) {
                if (splitPath[0] == route.mainRoute[j]) {
                    route.fn();
                    return;
                }
            }
        }
        thisFactory.goHome();
    }

    thisFactory.getParams = function () {
        var splitUri = $location.path().split("/");
        var params = {};
        var paramIndex = 0;
        for (var i = 0; i < splitUri.length; i++) {
            if (splitUri[i] != "") {
                params[paramIndex] = splitUri[i];
                paramIndex++;
            }
        }
        return params;
    }

    return thisFactory;

}]);
