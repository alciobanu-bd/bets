
var betsModule = angular.module(
    'bets', // module name
    [
        // dependencies
        'templates',
        'user',
        'resources',
        'config',
        'ranking'
    ]
);

var REST_HOSTNAME = '';
