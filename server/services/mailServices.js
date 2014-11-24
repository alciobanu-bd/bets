
var Templates = require('./mailTemplates.js');


var options = {
    fromAddress: 'CanIHazBets <contact@canihazbets.me>',
    replyToAddress: 'contact@canihazbets.me'
};

var sendMail = function (emailAddress, subject, body, onSuccess, onError) {

    var mailOptions = {
        from: options.fromAddress,
        to: emailAddress,
        replyTo: options.replyToAddress,
        subject: subject,
        text: body
    };

    mailTransporter.sendMail(mailOptions, function(error, info){
        if(error){
            if (typeof onError === 'function') {
                onError(error);
            }
        }
        else {
            if (typeof onSuccess === 'function') {
                info.mailOptions = mailOptions;
                onSuccess(info);
            }
        }
    });
}


var sendConfirmationLinkOnRegistration = function (user, code, onSuccess, onError) {

    var template = Templates[user.language].confirmationLinkOnRegistration(user.username, code);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}

var resendConfirmationLink = function (user, code, onSuccess, onError) {

    var template = Templates[user.language].resendConfirmationLink(user.username, code);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}

var sendConfirmationLinkOnPasswordChange = function (user, code, onSuccess, onError) {

    var template = Templates[user.language].confirmationLinkOnPasswordChange(user.username, code);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}

var sendConfirmationLinkOnForgotPassword = function (user, code, onSuccess, onError) {

    var template = Templates[user.language].confirmationLinkOnForgotPassword(user.username, code);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}

var sendNotificationAboutNewWeek = function (week, user, onSuccess, onError) {

    var events = week.events;
    var eventsText = '';

    for (var i = 0; i < events.length; i++) {
        eventsText += events[i].homeTeam + ' vs ' + events[i].awayTeam + '\r\n';
    }

    var endDate = (new Date(week.endDate)).toISOString();

    var template = Templates[user.language].notificationAboutANewWeek(user.username, week, endDate, eventsText);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}

var sendCongratulationsToWeekWinners = function (bet, user, onSuccess, onError) {

    var template = Templates[user.language].congratulationsToWeekWinners(user.username, bet);
    sendMail(user.email, template.subject, template.body, onSuccess, onError);

}


module.exports = {
    sendConfirmationLinkOnRegistration: sendConfirmationLinkOnRegistration,
    resendConfirmationLink: resendConfirmationLink,
    sendConfirmationLinkOnPasswordChange: sendConfirmationLinkOnPasswordChange,
    sendConfirmationLinkOnForgotPassword: sendConfirmationLinkOnForgotPassword,
    sendNotificationAboutNewWeek: sendNotificationAboutNewWeek,
    sendCongratulationsToWeekWinners: sendCongratulationsToWeekWinners
};
