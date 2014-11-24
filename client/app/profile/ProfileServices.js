
profileModule

.factory('ProfileFactory', [
'InitUrls', 'CallUrlService', '$translate',
function (InitUrls, CallUrlService, $translate) {

    var thisFactory = {};
    thisFactory.profileInformation = null;

    thisFactory.fetchingError = {
        active: true,
        message: ''
    }

    thisFactory.loadProfile = function (userId) {

        InitUrls.then(function (data) {
            CallUrlService.get({uri: data.user.address, id: userId},
            function (data) {
                thisFactory.profileInformation = data;
                thisFactory.fetchingError.active = false;
            },
            function (response) {
                thisFactory.fetchingError.active = true;
                if (response.data.message) {
                    thisFactory.fetchingError.message = response.data.message;
                }
                else {
                    thisFactory.fetchingError.message = $translate.instant(profilePage.errorFetching);
                }
            }
            );
        });

    }

    return thisFactory;

}
])
