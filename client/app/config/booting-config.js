
configModule.run([
'$rootScope', 'Templates', 'UserInformation', 'CurrentLanguageFactory', 'Languages', 'Settings',
function ($rootScope, Templates, UserInformation, CurrentLanguageFactory, Languages, Settings) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;
    $rootScope.CurrentLanguageFactory = CurrentLanguageFactory;
    $rootScope.Languages = Languages;
    $rootScope.Settings = Settings;

}]
);
