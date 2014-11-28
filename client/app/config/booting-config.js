
configModule.run([
'$rootScope', 'Templates', 'UserInformation', 'CurrentLanguageFactory', 'Languages', 'Settings', 'Geolocation',
function ($rootScope, Templates, UserInformation, CurrentLanguageFactory, Languages, Settings, Geolocation) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;
    $rootScope.CurrentLanguageFactory = CurrentLanguageFactory;
    $rootScope.Languages = Languages;
    $rootScope.Settings = Settings;


    $rootScope.geolocation = {
        available: false
    };

    Geolocation.then(function (data) {

        if (data.status == 'fail') {
            $rootScope.geolocation = {
                available: false
            };
        }
        else {
            $rootScope.geolocation = {
                data: data,
                available: true
            };
        }

    }, function (rejection) {
        $rootScope.geolocation = {
            available: false
        };
    });

}]
);
