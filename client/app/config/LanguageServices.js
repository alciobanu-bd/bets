
configModule

.factory('Languages', [
function () {

    var list = languagesListGLOBAL; // languagesListGLOBAL is defined in index.html

    var findByCode = function (code) {
        return _.find(list, function (lang) {
            return lang.code == code;
        });
    }

    return {
        list: list,
        findByCode: findByCode
    };
}
])

.factory('CurrentLanguageFactory', [
'Languages',
function (Languages) {

    var thisService = {};

    thisService.language = null;

    var loadFromStorage = function () {
        var langStr = localStorage.getItem('Lang');
        if (langStr) {
            var langObj = angular.fromJson(langStr);
            thisService.language = Languages.findByCode(langObj.code);
        }
        else {
            thisService.language = Languages.list.english;
        }
    }

    loadFromStorage();

    thisService.setLanguage = function (code) {

        if (code == thisService.language.code) {
            return;
        }

//        $translate.use(code);
//        thisService.language = Languages.findByCode(code);
        localStorage.setItem('Lang', JSON.stringify({code: code}));
        location.reload(); // reload is needed to load correct angular locale
    }

    return thisService;

}
]);
