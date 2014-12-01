
configModule.run([
'$rootScope', 'Templates', 'UserInformation', 'CurrentLanguageFactory', 'Languages', 'Settings', 'Geolocation',
'Socket',
function ($rootScope, Templates, UserInformation, CurrentLanguageFactory, Languages, Settings, Geolocation,
Socket) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;
    $rootScope.CurrentLanguageFactory = CurrentLanguageFactory;
    $rootScope.Languages = Languages;
    $rootScope.Settings = Settings;

    Socket.getSocket().then(function (socket) {
        socket.on('require-registration', function () {
            Socket.registerMe();
        });
    });

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
