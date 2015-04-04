
teamModule
.controller('NewTeamController', [
'$scope', '$modalInstance', 'Languages', 'CurrentLanguageFactory', 'CountryCodes', 'FileUploader',
'InitUrls', 'CallUrlService', 'TeamSerializer',
function ($scope, $modalInstance, Languages, CurrentLanguageFactory, CountryCodes, FileUploader,
          InitUrls, CallUrlService, TeamSerializer) {

    $scope.Languages = Languages;
    $scope.CountryCodes = CountryCodes;

    $scope.cancel = function () {
        $modalInstance.close("closed");
    }

    $scope.team = {
        name: {},
        city: {},
        details: {},
        nicknames: {},
        country: {
            code: '',
            name: ''
        },
        founded: '',
        website: '',
        image: null,
        isClub: true
    };

    for (var i in Languages.list) {
        var lang = Languages.list[i];
        $scope.team.name[lang.code] = "";
        $scope.team.city[lang.code] = "";
        $scope.team.details[lang.code] = "";
        $scope.team.nicknames[lang.code] = "";
    }

    $scope.selectedLangs = {
        name: CurrentLanguageFactory.getCurrentLanguage().code,
        city: CurrentLanguageFactory.getCurrentLanguage().code,
        details: CurrentLanguageFactory.getCurrentLanguage().code,
        nicknames: CurrentLanguageFactory.getCurrentLanguage().code
    };

    $scope.onTypeaheadCountrySelect = function (item) {
        $scope.team.country = {
            name: item.name,
            code: item.code
        };
    }

    $scope.savingStatus = {
        error: false,
        message: ""
    };

    $scope.save = function () {

        $scope.savingStatus.error = false;

        var onSaveError = function (response) {
            $scope.savingStatus.error = true;
            $scope.savingStatus.message = response.message;
        }

        InitUrls.then(function (urls) {
            FileUploader.uploadFile({uri: urls.team.logoUpload, file: $scope.team.image},
                function (data) {

                    CallUrlService.post({uri: urls.team.address}, TeamSerializer.serialize($scope.team, data.path),
                        function (data) {

                            TeamSerializer.adjustTeamForCurrentLanguage(data);
                            $modalInstance.close(data);

                        }, onSaveError);

                }, onSaveError
            );
        });
    }

}
]);