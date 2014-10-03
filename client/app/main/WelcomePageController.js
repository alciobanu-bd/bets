betsModule

.controller('WelcomeController', [
'$scope', 'UserInformation', 'InitUrls', 'Settings',
function ($scope, UserInformation, InitUrls, Settings) {

    $scope.userInfo = UserInformation;
    $scope.Settings = Settings;

    $scope.carouselSlides = [];

    var prepareSlides = function (n) {
        for (var i = 0; i < n; i++) {
            $scope.carouselSlides.push({
                image: '/images/carousel/' + i + '.jpg',
                title: carouselImagesDescription[i].title,
                description: carouselImagesDescription[i].description
            });
        }
    }

    prepareSlides(3);

}
]
);