
userModule

.controller(
'UserController', [
'$scope', 'UserInformation', 'UserInformationCalls', 'InitUrls', 'RolesFactory', 'RoutesFactory', 'CheckActivationStatus',
'Settings',
function ($scope, UserInformation, UserInformationCalls, InitUrls, RolesFactory, RoutesFactory, CheckActivationStatus,
Settings) {

    $scope.userInfo = UserInformation;
    $scope.RolesFactory = RolesFactory;
    $scope.RoutesFactory = RoutesFactory;

    $scope.inputs = {
        username: {
            model: ''
        },
        password: {
            model: ''
        },
        keepMeLoggedIn: {
            active: false,
            days: 3
        }
    };

    $scope.validateNumberOfKeepMeLoggedDays = function () {
        if (isNaN(parseInt($scope.inputs.keepMeLoggedIn.days))) {
            $scope.inputs.keepMeLoggedIn.days = 3;
        }
        if (parseInt($scope.inputs.keepMeLoggedIn.days) < 1) {
            $scope.inputs.keepMeLoggedIn.days = 1;
        }
        if (parseInt($scope.inputs.keepMeLoggedIn.days) > Settings.login.maxDaysOfKeepMeLoggedIn) {
            $scope.inputs.keepMeLoggedIn.days = Settings.login.maxDaysOfKeepMeLoggedIn;
        }
    }

    $scope.error = {
        message: '',
        encounteredError: false
    };

    $scope.loginOnEnterKey = function (ev) {
        if (ev.keyCode == 13) {
            $scope.login();
        }
        return false;
    }

    $scope.login = function () {

        $scope.loginInProgress = true;

        InitUrls.then(function (data) {
            var credentials = _.object(_.map($scope.inputs, function (item, key) {
                return [key, item.model];
            }));
            credentials.keepMeLoggedIn = $scope.inputs.keepMeLoggedIn.active;
            credentials.keepMeLoggedFor = $scope.inputs.keepMeLoggedIn.days;
            var loginPromise = UserInformationCalls.login(data, credentials);

            loginPromise.then(
            function (data) {
                $scope.encounteredError = false;
                RoutesFactory.resetPath();
                RoutesFactory.goHome();
                CheckActivationStatus.check();
                $scope.loginInProgress = false;
            },
            function (rejection) {
                $scope.error.encounteredError = true;
                $scope.error.message = rejection.data.message;
                $scope.loginInProgress = false;
            }
            );

        });

    }

    $scope.logout = function () {
        UserInformationCalls.logout();
        RoutesFactory.resetPath();
        RoutesFactory.goHome();
    }

}
]
);
