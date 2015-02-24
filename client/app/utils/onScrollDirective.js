
utilsModule.directive('onScroll', [
    '$timeout',
    function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            onScroll: '&'
        },
        link: function (scope, element, attrs) {
            element.bind('scroll', function () {
                $timeout(scope.onScroll, 0);
            });
        }
    };
}]);
