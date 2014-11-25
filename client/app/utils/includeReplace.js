
utilsModule.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
