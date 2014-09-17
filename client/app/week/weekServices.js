
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

    thisFactory.fetchCurrentWeek = function (callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.current},
                    function (data) {
                        thisFactory.error.current.active = false;
                        thisFactory.currentWeek = data;
                        callWhenDone();
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

    thisFactory.fetchBeforeCurrentWeek = function (callWhenDone) {

        InitUrls.then(
            function (data) {
                CallUrlService.get({uri: data.week.beforeLast},
                    function (data) {
                        thisFactory.error.beforeCurrent.active = false;
                        thisFactory.beforeCurrentWeek = data;
                        callWhenDone();
                    },
                    function (response) {
                        thisFactory.error.beforeCurrent.active = true;
                        thisFactory.error.beforeCurrent.message = "An error occured while trying to fetch a week.";
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

    BetService.prototype.place = function (bets) {

        this.resetBetService();
        var self = this;

        InitUrls.then(function (data) {

            CallUrlService.post({uri: data.bet.address}, bets,
            function (data) {
                self.afterPlacement.message = 'Your bet was successfully placed.';
                self.afterPlacement.success = true;
                self.inProgress = false;
            },
            function (response) {
                if (response.data.message) {
                    self.afterPlacement.message = response.data.message;
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

    return {
        newBetManager: function () {
            return new BetService();
        }
    };

}
])

;
