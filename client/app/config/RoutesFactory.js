
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
        thisFactory.currentBodyView = Templates.user.login;
        $location.path(thisFactory.currentBodyView.route);

        if (UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToRegister = function () {
        thisFactory.currentBodyView = Templates.user.register;
        $location.path(thisFactory.currentBodyView.route);

        if (UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToRanking = function () {
        thisFactory.currentBodyView = Templates.ranking;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToWeek = function () {
        thisFactory.currentBodyView = Templates.week;
        $location.path(thisFactory.currentBodyView.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToProfile = function () {
        thisFactory.currentBodyView = Templates.account.profile;
        $location.path(thisFactory.currentBodyView.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToHistory = function () {
        thisFactory.currentBodyView = Templates.bet.history;
        $location.path(thisFactory.currentBodyView.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToActivation = function () {
        thisFactory.currentBodyView = Templates.activation;
        $location.path(Templates.activation.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToAdminPanel = function () {
        thisFactory.currentBodyView = Templates.admin;
        $location.path(Templates.admin.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
    }

    thisFactory.goToRules = function () {
        thisFactory.currentBodyView = Templates.rules;
        $location.path(Templates.rules.route);

        if (!UserInformation.isLogged) {
            thisFactory.goHome();
        }
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
