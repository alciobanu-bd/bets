
weekModule

.factory('WeekFactory',[
'InitUrls', 'CallUrlService', '$translate', 'CurrentLanguageFactory',
function (InitUrls, CallUrlService, $translate, CurrentLanguageFactory) {

    var thisFactory = {};

    thisFactory.error = {
        current: {
            active: false,
            message: ''
        },
        beforeCurrent: {
            active: false,
            message: ''
        },
        currentBet: {
            active: false,
            message: ''
        },
        beforeCurrentBet: {
            active: false,
            message: ''
        },
        all: {
            active: false,
            message: ''
        },
        weeksByNumberError: {},
        betsByWeekNumberError: {}
    };

    thisFactory.resetWeekFactory = function () {

        thisFactory.error = _.object(_.map(thisFactory.error, function (item, key) {
            item.active = false;
            item.message = '';
            return [key, item];
        }));

        thisFactory.currentWeek = null;
        thisFactory.currentWeekBet = null;
        thisFactory.beforeCurrentWeek = null;
        thisFactory.beforeCurrentWeekBet = null;
        thisFactory.allWeeks = null;

        thisFactory.weeksByNumber = {};
        thisFactory.betsByWeekNumber = {};
    }

    thisFactory.fetchWeekByNumber = function (callWhenDone, weekNo) {
        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.getByNumber, number: weekNo},
                    function (data) {
                        data.events = _.map(data.events, function (event) {
                            if (event.awayScore || event.awayScore == 0) {
                                event.realAwayScore = event.awayScore;
                                delete event.awayScore;
                            }
                            if (event.homeScore || event.homeScore == 0) {
                                event.realHomeScore = event.homeScore;
                                delete event.homeScore;
                            }
                            return event;
                        });
                        if (!angular.isDefined(thisFactory.error.weeksByNumberError[weekNo])) {
                            thisFactory.error.weeksByNumberError[weekNo] = {};
                        }
                        thisFactory.error.weeksByNumberError[weekNo].active = false;
                        thisFactory.weeksByNumber[weekNo] = data;
                        if (typeof callWhenDone === 'function') {
                            callWhenDone();
                        }
                    },
                    function (response) {
                        if (!angular.isDefined(thisFactory.error.weeksByNumberError[weekNo])) {
                            thisFactory.error.weeksByNumberError[weekNo] = {};
                        }
                        thisFactory.error.weeksByNumberError[weekNo].active = true;
                        thisFactory.error.weeksByNumberError[weekNo].message = $translate.instant('weekPage.anErrorTryingToFetchWeekNo') + " " + weekNo;
                    }
                );
            }
        );
    }

    thisFactory.fetchCurrentWeek = function (callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.current},
                    function (data) {
                        data.events = _.map(data.events, function (event) {
                            if (event.awayScore || event.awayScore == 0) {
                                event.realAwayScore = event.awayScore;
                                delete event.awayScore;
                            }
                            if (event.homeScore || event.homeScore == 0) {
                                event.realHomeScore = event.homeScore;
                                delete event.homeScore;
                            }
                            return event;
                        });
                        thisFactory.error.current.active = false;
                        thisFactory.currentWeek = data;
                        if (typeof callWhenDone === 'function') {
                            callWhenDone();
                        }
                    },
                    function (response) {
                        thisFactory.error.current.active = true;
                        thisFactory.error.current.message = $translate.instant('weekPage.anErrorTryingToFetchAWeek');
                    }
                );
            }
        );
    }

    thisFactory.fetchBetForWeekByNumber = function (weekObject, onSuccess, onError) {
        if (weekObject.number < 1) {
            return;
        }
        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.bet.byWeek, weekNumber: weekObject.number},
                    function (data) {
                        if (!angular.isDefined(thisFactory.error.betsByWeekNumberError[weekObject.number])) {
                            thisFactory.error.betsByWeekNumberError[weekObject.number] = {};
                        }
                        thisFactory.error.betsByWeekNumberError[weekObject.number].active = false;
                        thisFactory.betsByWeekNumber[weekObject.number] = data;

                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }

                    },
                    function (response) {
                        if (!angular.isDefined(thisFactory.error.betsByWeekNumberError[weekObject.number])) {
                            thisFactory.error.betsByWeekNumberError[weekObject.number] = {};
                        }
                        thisFactory.error.betsByWeekNumberError[weekObject.number].active = true;
                        if (response.data.message) {
                            thisFactory.error.betsByWeekNumberError[weekObject.number].message = response.data.message;
                        }
                        else {
                            thisFactory.error.betsByWeekNumberError[weekObject.number].message = $translate.instant('weekPage.anErrorTryingToFetchBets');
                        }

                        if (typeof onError === 'function') {
                            onError();
                        }

                    }
                );
            }
        );
    }

    thisFactory.fetchCurrentWeekBet = function () {
        if (thisFactory.currentWeek.number < 1) {
            return;
        }
        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.bet.byWeek, weekNumber: thisFactory.currentWeek.number},
                    function (data) {
                        thisFactory.error.currentBet.active = false;
                        thisFactory.currentWeekBet = data;
                    },
                    function (response) {
                        thisFactory.error.currentBet.active = true;
                        if (response.data.message) {
                            thisFactory.error.currentBet.message = response.data.message;
                        }
                        else {
                            thisFactory.error.currentBet.message = $translate.instant('weekPage.anErrorTryingToFetchBets');
                        }
                    }
                );
            }
        );
    }

    thisFactory.fetchBeforeCurrentWeekBet = function () {
        if (thisFactory.beforeCurrentWeek.number < 1) {
            return;
        }
        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.bet.byWeek, weekNumber: thisFactory.beforeCurrentWeek.number},
                    function (data) {
                        thisFactory.error.beforeCurrentBet.active = false;
                        thisFactory.beforeCurrentWeekBet = data;
                    },
                    function (response) {
                        thisFactory.error.beforeCurrentBet.active = true;
                        if (response.data.message) {
                            thisFactory.error.beforeCurrentBet.message = response.data.message;
                        }
                        else {
                            thisFactory.error.beforeCurrentBet.message = "An error occurred while trying to fetch your bets.";
                        }
                    }
                );
            }
        );
    }

    thisFactory.fetchBeforeCurrentWeek = function (callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.beforeLast},
                    function (data) {

                        data.events = _.map(data.events, function (event) {
                            if (event.awayScore || event.awayScore == 0) {
                                event.realAwayScore = event.awayScore;
                                delete event.awayScore;
                            }
                            if (event.homeScore || event.homeScore == 0) {
                                event.realHomeScore = event.homeScore;
                                delete event.homeScore;
                            }
                            return event;
                        });
                        thisFactory.error.beforeCurrent.active = false;
                        thisFactory.beforeCurrentWeek = data;
                        if (typeof callWhenDone === 'function') {
                            callWhenDone();
                        }
                    },
                    function (response) {
                        thisFactory.error.beforeCurrent.active = true;
                        thisFactory.error.beforeCurrent.message = $translate.instant('weekPage.anErrorTryingToFetchAWeek');
                    }
                );
            }
        );
    }

    thisFactory.updateResults = function (eventsWithResults, week_id, onSuccess, onError) {

        eventsWithResults = _.map(eventsWithResults, function (event) {
            if (event.realHomeScore || event.realHomeScore == 0) {
                delete event.realHomeScore;
            }
            if (event.awayHomeScore || event.awayHomeScore == 0) {
                delete event.awayHomeScore;
            }
            return event;
        });

        InitUrls.then(
            function (data) {
                CallUrlService.put({uri: data.week.address, id: week_id},
                    {events: eventsWithResults, updateScore: true}, // put data
                    function (data) {
                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }
                    },
                    function (response) {
                        if (typeof onError === 'function') {
                            onError();
                        }
                    }
                );
            }
        );

    }

    thisFactory.fetchAllWeeks = function () {

        InitUrls.then(function (data) {

            CallUrlService.get({uri: data.week.address},
                function (data) {
                    thisFactory.allWeeks = data;
                },
                function (response) {
                    thisFactory.error.all.active = true;
                    thisFactory.error.all.message = $translate.instant('weekPage.anErrorOccurred');
                }
            );

        });

    }


    var adjustTeamForCurrentLanguage = function (team) {

        var currentLangFn = function (item) {
            return item.lang == CurrentLanguageFactory.getCurrentLanguage().code;
        }

        var getValueOnly = function (item) {
            return item.value;
        }

        team.name = _.find(team.name, currentLangFn);
        if(!team.name) {
            delete team.name;
        }
        else {
            team.name = team.name.value;
        }

        team.city = _.find(team.city, currentLangFn);
        if(!team.city) {
            delete team.city;
        }
        else {
            team.city = team.city.value;
        }

        team.details = _.find(team.details, currentLangFn);
        if(!team.details) {
            delete team.details;
        }
        else {
            team.details = team.details.value;
        }

        team.nicknames = _.map(_.filter(team.nicknames, currentLangFn), getValueOnly);

    }

    thisFactory.getTeamsByName = function (name, onSuccess, onError) {

        InitUrls.then(function (urls) {

            CallUrlService.getArray({uri: urls.team.getByName, id: name},
                function (data) {
                    if (typeof onSuccess === 'function') {
                        var teams = [];
                        for (var i = 0; i < data.length; i++) {
                            adjustTeamForCurrentLanguage(data[i]);
                            teams.push(data[i]);
                        }
                        onSuccess(teams);
                    }
                },
                function (response) {
                    if (typeof onError === 'function') {
                        onError(response);
                    }
                }
            );

        });

    }

    return thisFactory;

}
])

.service('BetService', [
'InitUrls', 'CallUrlService', '$translate',
function (InitUrls, CallUrlService, $translate) {

    var BetService = function () {
        this.inProgress = false;
        this.afterPlacement = {
            error: false,
            success: false,
            message: ''
        };
        return this;
    };

    BetService.prototype.resetBetService = function () {
        this.inProgress = false;
        this.afterPlacement.error = false;
        this.afterPlacement.success = false;
        this.afterPlacement.message = '';
    }

    var postBet = function (bets, onSuccess, onError, self) {

        InitUrls.then(function (data) {

            CallUrlService.post({uri: data.bet.address}, bets,
                function (data) {
                    self.afterPlacement.message = $translate.instant('weekPage.betPlacementSuccess');
                    self.afterPlacement.success = true;
                    self.inProgress = false;
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                },
                function (response) {
                    if (response.data.message) {
                        self.afterPlacement.message = response.data.message;
                        if (typeof onError === 'function') {
                            onError();
                        }
                    }
                    else {
                        self.afterPlacement.message = $translate.instant('weekPage.betPlacementError');
                    }
                    self.afterPlacement.error = true;
                    self.inProgress = false;
                }
            );

        });
    }

    var putBet = function (bets, currentBet, onSuccess, onError, self) {

        InitUrls.then(function (data) {

            CallUrlService.put({uri: data.bet.address, id: currentBet._id}, bets,
                function (data) {
                    self.afterPlacement.message = $translate.instant('weekPage.betChangeSuccess');
                    self.afterPlacement.success = true;
                    self.inProgress = false;
                    if (typeof onSuccess === 'function') {
                        onSuccess();
                    }
                },
                function (response) {
                    if (response.data.message) {
                        self.afterPlacement.message = response.data.message;
                        if (typeof onError === 'function') {
                            onError();
                        }
                    }
                    else {
                        self.afterPlacement.message = $translate.instant('weekPage.betPlacementError');
                    }
                    self.afterPlacement.error = true;
                    self.inProgress = false;
                }
            );

        });
    }

    BetService.prototype.place = function (bets, currentBet, onSuccess, onError) {

        var self = this;

        this.resetBetService();

        if (currentBet) {
            // it means user has already placed a bet -- method: PUT
            putBet(bets, currentBet, onSuccess, onError, self);
        }
        else {
            // it means user has not placed a bet - method: POST
            postBet(bets, onSuccess, onError, self);
        }

    }

    return {
        newBetManager: function () {
            return new BetService();
        }
    };

}
])

;
