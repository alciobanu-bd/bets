
configModule

.factory('RoutesFactory', [
'UserInformation', 'Templates', '$location',
function (UserInformation, Templates, $location) {

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
    }

    thisFactory.goToRegister = function () {
        thisFactory.currentBodyView = Templates.user.register;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToRanking = function () {
        thisFactory.currentBodyView = Templates.ranking;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToWeek = function () {
        thisFactory.currentBodyView = Templates.week;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToProfile = function () {
        thisFactory.currentBodyView = Templates.account.profile;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToHistory = function () {
        thisFactory.currentBodyView = Templates.bet.history;
        $location.path(thisFactory.currentBodyView.route);
    }

    thisFactory.goToActivation = function () {
        thisFactory.currentBodyView = Templates.activation;
        $location.path(Templates.activation.route);
    }

    thisFactory.goToAdminPanel = function () {
        thisFactory.currentBodyView = Templates.admin;
        $location.path(Templates.admin.route);
    }

    return thisFactory;

}]);
