
weekModule

.factory('WeekFactory',[
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

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
        }
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

    }

    thisFactory.fetchCurrentWeek = function (callEventsWithRealScores, callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.current},
                    function (data) {
                        if (typeof callEventsWithRealScores === 'function') {
                            callEventsWithRealScores(data);
                        }
                        data.events = _.map(data.events, function (event) {
                            if (event.awayScore || event.awayScore == 0) {
                                delete event.awayScore;
                            }
                            if (event.homeScore || event.homeScore == 0) {
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
                        thisFactory.error.current.message = "An error occured while trying to fetch a week.";
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
                            thisFactory.error.currentBet.message = "An error occured while trying to fetch your bets.";
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
                            thisFactory.error.beforeCurrentBet.message = "An error occured while trying to fetch your bets.";
                        }
                    }
                );
            }
        );
    }

    thisFactory.fetchBeforeCurrentWeek = function (callEventsWithRealScores, callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.beforeLast},
                    function (data) {
                        if (typeof callEventsWithRealScores === 'function') {
                            callEventsWithRealScores(data);
                        }
                        data.events = _.map(data.events, function (event) {
                            if (event.awayScore || event.awayScore == 0) {
                                delete event.awayScore;
                            }
                            if (event.homeScore || event.homeScore == 0) {
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
                        thisFactory.error.beforeCurrent.message = "An error occured while trying to fetch a week.";
                    }
                );
            }
        );
    }

    thisFactory.updateResults = function (eventsWithResults, week_id, onSuccess, onError) {

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
                thisFactory.error.all.message = "An error occured.";
            }
            );

        });

    }

    return thisFactory;

}
])

.service('BetService',[
'InitUrls', 'CallUrlService',
function (InitUrls, CallUrlService) {

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
                    self.afterPlacement.message = 'Your bet was successfully placed.';
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
                        self.afterPlacement.message = 'Your bet wasn\'t placed. Please try again.';
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
                    self.afterPlacement.message = 'Your bet was successfully changed.';
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
                        self.afterPlacement.message = 'Your bet wasn\'t placed. Please try again.';
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
