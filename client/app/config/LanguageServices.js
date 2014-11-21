
configModule

.factory('Languages', [
function () {

    var list = {
        english: {
            code: 'en',
            name: 'English',
            imgPath: '/images/flags16/EN.png'
        },
        romanian: {
            code: 'ro',
            name: 'Română',
            imgPath: '/images/flags16/RO.png'
        }
    };

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
'Languages', '$translate',
function (Languages, $translate) {

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
        $translate.use(code);
        thisService.language = Languages.findByCode(code);
        localStorage.setItem('Lang', JSON.stringify({code: code}));
    }

    return thisService;

}
]);
