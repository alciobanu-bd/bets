
teamModule
.controller
('TeamController',[
'$scope', 'TeamFactory', '$translate', '$timeout', 'CountryCodes',
function ($scope, TeamFactory, $translate, $timeout, CountryCodes) {

    $scope.CountryCodes = CountryCodes;

    $scope.status = {
        error: false,
        inProgress: true,
        message: ""
    };

    $scope.filter = {
        isClub: true,
        countryCodes: {},
        sort: {
            alphabetically: {
                id: 0,
                name: $translate.instant('teams.alphabetically'),
                sortFunction: function (team1, team2) {
                    if (team1.name > team2.name) {
                        return 1;
                    }
                    return -1;
                }
            },
            byYearFounded: {
                id: 1,
                name: $translate.instant('teams.byYearFounded'),
                sortFunction: function (team1, team2) {
                    return team1.founded - team2.founded
                }
            }
        }
    };

    $scope.selectedSort = $scope.filter.sort.alphabetically;

    $scope.selectSort = function (sort) {
        $scope.selectedSort = sort;
        $scope.teams.sort(sort.sortFunction);
    }

    var setCountryCodes = function (teams) {
        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            if (team.isClub) {
                if (angular.isDefined($scope.filter.countryCodes[team.countryCode])) {
                    $scope.filter.countryCodes[team.countryCode] = !!$scope.filter.countryCodes[team.countryCode];
                }
                else {
                    $scope.filter.countryCodes[team.countryCode] = true;
                }
            }
        }
    }

    $scope.getTeams = function () {
        TeamFactory.getTeams($scope.filter,
            function (teams) {
                teams.sort($scope.selectedSort.sortFunction);
                $scope.teams = teams;
                $timeout(function() {
                    setCountryCodes(teams);
                }, 0);
            }, function (response) {
                $scope.status.error = true;
                $scope.status.inProgress = false;
                $scope.status.message = $translate.instant('teams.errorFetchingTeams');
            });
    }

    $scope.getTeams();

    $scope.isCountryFilterOpened = false;
    $scope.toggleCountryFilter = function (event) {
        $scope.isCountryFilterOpened = !$scope.isCountryFilterOpened;
        event.stopPropagation();
    }

    $scope.closeDropdown = function () {
        $scope.isCountryFilterOpened = false;
    }

    $scope.toggleCountry = function (code) {
        $scope.filter.countryCodes[code] = !$scope.filter.countryCodes[code];
    }

    $scope.resetCountryFilter = function () {
        for (var i in $scope.filter.countryCodes) {
            $scope.filter.countryCodes[i] = true;
        }
    }

}
]);
