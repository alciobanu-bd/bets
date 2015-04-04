
configModule.config(['$routeProvider', 'TemplatesProvider',
function($routeProvider, TemplatesProvider) {

    var Templates = TemplatesProvider.$get();

    var redirectHomeIfLogged = [
    'UserInformation', '$location',
    function (UserInformation, $location) {
        if (UserInformation.isLogged) {
            $location.path('/');
        }
    }];

    var redirectHomeIfNotLogged = [
    'UserInformation', '$location',
    function (UserInformation, $location) {
        if (!UserInformation.isLogged) {
            $location.path('/');
        }
    }];

    var redirectHomeIfActive = ['UserInformation', '$location',
    function (UserInformation, $location) {
        UserInformation.ready(function () {
            if (UserInformation.isLogged && UserInformation.user.active) {
                $location.path('/');
            }
        });
    }];

    var redirectHomeIfNotAdmin = [
    'UserInformation', '$location', 'RolesFactory',
    function (UserInformation, $location, RolesFactory) {
        UserInformation.ready(function () {
            RolesFactory.load().then(
                function () {
                    if (!UserInformation.isLogged || !RolesFactory.userHasRole(UserInformation.user.role, RolesFactory.roles.admin)) {
                        $location.path('/');
                    }
                }
            );
        });
    }];

    $routeProvider.
        when('/', {
            templateUrl: 'app/main/views/welcome.html',
            controller: 'WelcomeController'
        }).
        when('/register', {
            templateUrl: Templates.user.register.html,
            controller: 'RegisterController',
            resolve: {
                redirect: redirectHomeIfLogged
            }
        }).
        when('/login', {
            templateUrl: Templates.user.login.html,
            controller: 'UserController',
            resolve: {
                redirect: redirectHomeIfLogged
            }
        }).
        when('/week', {
            templateUrl: Templates.week.html,
            controller: 'WeekController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/ranking', {
            templateUrl: Templates.ranking.html,
            controller: 'RankingController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/rules', {
            templateUrl: Templates.rules.html,
            controller: 'RulesController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/team', {
            templateUrl: Templates.team.html,
            controller: 'TeamController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/profile', {
            templateUrl: Templates.account.profile.html,
            controller: 'ProfileController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/history/:userId?', {
            templateUrl: Templates.history.html,
            controller: 'HistoryController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/admin', {
            templateUrl: Templates.admin.html,
            controller: 'AdminPanelController',
            resolve: {
                redirect: redirectHomeIfNotAdmin
            }
        }).
        when('/change-password', {
            templateUrl: Templates.user.changePassword.html,
            controller: 'ChangePasswordController',
            resolve: {
                redirect: redirectHomeIfNotLogged
            }
        }).
        when('/forgot-password', {
            templateUrl: Templates.user.forgotPassword.html,
            controller: 'ForgotPasswordController'
        }).
        when('/reset-password/:code?', {
            templateUrl: Templates.user.resetPassword.html,
            controller: 'ResetPasswordController'
        }).
        when('/activation', {
            templateUrl: Templates.account.activation.html,
            controller: 'AccountActivationController',
            resolve: {
                redirectNotLogged: redirectHomeIfNotLogged,
                redirect: redirectHomeIfActive
            }
        }).
        otherwise({
            redirectTo: '/'
        });
}]);
