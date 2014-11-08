
configModule.config(['$routeProvider', 'TemplatesProvider',
function($routeProvider, TemplatesProvider) {

    var Templates = TemplatesProvider.$get();

    $routeProvider.
        when('/', {
            templateUrl: 'app/main/views/welcome.html',
            controller: 'WelcomeController'
        }).
        when('/register', {
            templateUrl: Templates.user.register.html,
            controller: 'RegisterController'
        }).
        when('/login', {
            templateUrl: Templates.user.login.html,
            controller: 'UserController'
        }).
        when('/week', {
            templateUrl: Templates.week.html,
            controller: 'WeekController'
        }).
        when('/ranking', {
            templateUrl: Templates.ranking.html,
            controller: 'RankingController'
        }).
        when('/rules', {
            templateUrl: Templates.rules.html,
            controller: 'RulesController'
        }).
        when('/profile', {
            templateUrl: Templates.account.profile.html,
            controller: 'ProfileController'
        }).
        when('/history/:userId?', {
            templateUrl: Templates.history.html,
            controller: 'HistoryController'
        }).
        when('/admin', {
            templateUrl: Templates.admin.html,
            controller: 'AdminPanelController'
        }).
        when('/change-password', {
            templateUrl: Templates.user.changePassword.html,
            controller: 'ChangePasswordController'
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
            controller: 'AccountActivationController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);
