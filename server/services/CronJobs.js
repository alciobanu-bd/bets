
/*
 * See https://github.com/ncb000gt/node-cron for details about cron library used here.
 */

var CronJob = require('cron').CronJob;
var User = require('./../model/User.js');

var fs = require('fs');
var CRON_DELETE_INACTIVE_USERS_LOG_FILE = 'logs/cron_delete_inactive_users.txt';


new CronJob('* 0 4 * * 3', // weekly, 3rd day of the week (Wednesday) at 4 am
function() {
    // job to be executed

    var oneMonthBack = new Date((new Date()).setMonth((new Date()).getMonth() - 1));

    User.remove({$or:
        [{active: false, registerDate: {$lt: oneMonthBack}, lastLogin: {$lt: oneMonthBack}},
        {active: false, registerDate: {$lt: oneMonthBack}, lastLogin: {$exists: false}}]},
    // delete all users who didn't activate their account in one month and didn't login in one month
    function (err, users) {
        if (err) {
            fs.appendFile(CRON_DELETE_INACTIVE_USERS_LOG_FILE, new Date() + " ERR: " + err + "\r\n\r\n");
        }
        else if (!users || users.length == 0) {
            fs.appendFile(CRON_DELETE_INACTIVE_USERS_LOG_FILE, new Date() + " SUCC: No users." + "\r\n\r\n");
        }
        else {
            fs.appendFile(CRON_DELETE_INACTIVE_USERS_LOG_FILE, new Date() + " SUCC: " + JSON.stringify(users) + "\r\n\r\n");
        }
    });

},
function () {
    // executed when job is done
},
true // whether to start job right now
);
