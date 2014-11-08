
configModule.run([
'$rootScope', 'Templates', 'UserInformation',
function ($rootScope, Templates, UserInformation) {

    $rootScope.Templates = Templates;
    $rootScope.userInfo = UserInformation;

}]
);
