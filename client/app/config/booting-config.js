
configModule.run([
'$rootScope', 'Templates', 'UserInformation', 'CurrentLanguageFactory', 'Languages', 'Settings', 'Geolocation',
'Socket', 'ChattingService',
function ($rootScope, Templates, UserInformation, CurrentLanguageFactory, Languages, Settings, Geolocation,
Socket, ChattingService) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;
    $rootScope.CurrentLanguageFactory = CurrentLanguageFactory;
    $rootScope.Languages = Languages;
    $rootScope.Settings = Settings;
    $rootScope.ChattingService = ChattingService;

    Socket.getSocket().then(function (socket) {
        socket.on('require-registration', function () {
            if (UserInformation.isLogged) {
                Socket.registerMe();
            }
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

    $rootScope.$watch(ChattingService.getNumberOfUnreadConversations, function () {
        var unreadMessages = $rootScope.ChattingService.getNumberOfUnreadConversations();
        if (unreadMessages != null && unreadMessages != undefined && unreadMessages > 0) {
            document.title = "(" + unreadMessages + ") " + "CanIHazBets - online betting for fun";
        }
        else {
            document.title = "CanIHazBets - online betting for fun";
        }
    });

}]
);
