
var humanize = require('humanize');

var sendMail = function (mailOptions, onSuccess, onError) {
    mailTransporter.sendMail(mailOptions, function(error, info){
        if(error){
            if (typeof onError === 'function') {
                onError(error);
            }
        }
        else {
            if (typeof onSuccess === 'function') {
                onSuccess(info);
            }
        }
    });
}

var sendConfirmationLinkOnRegistration = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'CanIHazBets <contact@canihazbets.me>',
        to: emailAddress,
        replyTo: 'contact@canihazbets.me',
        subject: 'Registration at ' + domainName.beautifulName,
        text: 'Welcome to ' + domainName.beautifulName + ', ' +
            '\r\n\r\n' +
            'Dear ' + username + ',' +
            '\r\n' +
            'We are pleased that you registered at our site. We hope you will have a pleasant staying.' +
            '\r\n\r\n' +
            'In order to activate your account, use the next code after you login to GuessTheScore.com' +
            '\r\n' +
            code
    };

    sendMail(mailOptions, onSuccess, onError);

}

var sendConfirmationLinkOnPasswordChange = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'CanIHazBets <contact@canihazbets.me>',
        to: emailAddress,
        replyTo: 'contact@canihazbets.me',
        subject: 'Changed password at ' + domainName.beautifulName,
        text: 'Dear ' + username + ',' +
            '\r\n' +
            'We detected that you changed your password.' +
            '\r\n\r\n' +
            'In order to re-activate your account after change, use the next code:' +
            '\r\n' +
            code
    };

    sendMail(mailOptions, onSuccess, onError);

}

var sendConfirmationLinkOnForgotPassword = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'CanIHazBets <contact@canihazbets.me>',
        to: emailAddress,
        replyTo: 'contact@canihazbets.me',
        subject: 'Password reset at ' + domainName.beautifulName,
        text: 'Dear ' + username + ',' +
            '\r\n' +
            'You recently required a code to reset your password.' +
            '\r\n\r\n' +
            'In order to change your password, use the next link:' +
            '\r\n' +
            domainName.address + "/#/reset-password/" + code +
            '\r\n\r\n' +
            'If the link doesn\'t work, please go to ' + domainName.address + "/#/reset-password" +
            ' and use the following code:' +
            '\r\n' + code
    };

    sendMail(mailOptions, onSuccess, onError);

}

var sendNotificationAboutNewWeek = function (week, username, emailAddress, onSuccess, onError) {

    var events = week.events;
    var eventsText = '';

    for (var i = 0; i < events.length; i++) {
        eventsText += events[i].homeTeam + ' vs ' + events[i].awayTeam + '\r\n';
    }

    var mailOptions = {
        from: 'CanIHazBets <contact@canihazbets.me>',
        to: emailAddress,
        replyTo: 'contact@canihazbets.me',
        subject: 'New week at ' + domainName.beautifulName,
        text: 'Dear ' + username + ',' +
            '\r\n' +
            'We are glad to announce you that a new week (#' + week.number + ') is available on ' +
            domainName.beautifulName + '.' +
            '\r\n\r\n' +
            'The matches we selected for this week are: ' +
            '\r\n' + eventsText +
            '\r\n\r\n' +
            'The deadline since you can guess the scores is ' +
            humanize.date('d.m.Y h:i A', week.endDate) + '.\r\n' +
            'Don\'t miss it. Act now!'

    };

    sendMail(mailOptions, onSuccess, onError);

}

module.exports = {
    sendConfirmationLinkOnRegistration: sendConfirmationLinkOnRegistration,
    sendConfirmationLinkOnPasswordChange: sendConfirmationLinkOnPasswordChange,
    sendConfirmationLinkOnForgotPassword: sendConfirmationLinkOnForgotPassword,
    sendNotificationAboutNewWeek: sendNotificationAboutNewWeek
}
