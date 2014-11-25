
configModule.run([
'$rootScope', 'Templates', 'UserInformation', 'CurrentLanguageFactory', 'Languages',
function ($rootScope, Templates, UserInformation, CurrentLanguageFactory, Languages) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;
    $rootScope.CurrentLanguageFactory = CurrentLanguageFactory;
    $rootScope.Languages = Languages;

}]
);
