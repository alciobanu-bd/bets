
var sendConfirmationLinkOnRegistration = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'no-reply <no-reply@guessthescore.com>',
        to: emailAddress,
        subject: 'Registration at GuessTheScore.com',
        text: 'Welcome to GuessTheScore.com, ' +
            '\r\n\r\n' +
            'Dear ' + username + ',' +
            '\r\n' +
            'We are pleased that you registered at our site. We hope you will have a pleasant staying.' +
            '\r\n\r\n' +
            'In order to activate your account, use the next code after you login to GuessTheScore.com' +
            '\r\n' +
            code
    };

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

module.exports = {
    sendConfirmationLinkOnRegistration: sendConfirmationLinkOnRegistration
}
