
rankingModule

.factory('RankingFactory',[
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

    thisFactory = {};

    thisFactory.ranking = [];
    thisFactory.errorFetching = false;

    thisFactory.fetchRanking = function () {

        thisFactory.ranking = [];


        InitUrls.then(
        function (data) {
            CallUrlService.getArray({uri: data.user.ranking},
            function (data) {
                thisFactory.ranking = _.map(data, function (item) {return {
                    _id: item._id,
                    place: item.place,
                    points: item.points,
                    avgPoints: item.avgPoints,
                    registerDate: item.registerDate,
                    role: item.role,
                    username: item.username
                }});
                thisFactory.errorFetching = false;
            },
            function (response) {
                thisFactory.errorFetching = true;
                thisFactory.errorMessage = response.data.message;
            }
            );
        });

    }

    return thisFactory;

}
])

;
