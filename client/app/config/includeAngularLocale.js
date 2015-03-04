
var languagesListGLOBAL = {
    english: {
        code: 'en',
        name: 'English',
        imgPath: '/images/flags16/EN.png',
        localePath: 'lib/angular-i18n/angular-locale_en-us.js'
    },
    romanian: {
        code: 'ro',
        name: 'Română',
        imgPath: '/images/flags16/RO.png',
        localePath: 'lib/angular-i18n/angular-locale_ro-ro.js'
    }
};

var langStorage = localStorage.getItem('Lang');
var lang;

if (langStorage) {
    lang = JSON.parse(langStorage).code;
}
else {
    lang = languagesListGLOBAL.english.code;
}

for (var i in languagesListGLOBAL) {
    var l = languagesListGLOBAL[i];
    if (l.code == lang) {
        document.write('<script src="' + l.localePath + '"><\/script>');
    }
}
