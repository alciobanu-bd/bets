
var betsModule = angular.module(
    'bets', // module name
    [
        // dependencies
        'templates',
        'user',
        'resources',
        'config',
        'ranking',
        'week'
    ]
);

var REST_HOSTNAME = ''; // relative path to local rest provider
