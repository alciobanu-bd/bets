
var sendConfirmationLinkOnRegistration = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'no-reply <no-reply@guessthescore.com>',
        to: emailAddress,
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

var sendConfirmationLinkOnPasswordChange = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'no-reply <no-reply@guessthescore.com>',
        to: emailAddress,
        subject: 'Changed password at ' + domainName.beautifulName,
        text: 'Dear ' + username + ',' +
            '\r\n' +
            'We detected that you changed your password.' +
            '\r\n\r\n' +
            'In order to re-activate your account after change, use the next code:' +
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

var sendConfirmationLinkOnForgotPassword = function (username, emailAddress, code, onSuccess, onError) {
    var mailOptions = {
        from: 'no-reply <no-reply@guessthescore.com>',
        to: emailAddress,
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
    sendConfirmationLinkOnRegistration: sendConfirmationLinkOnRegistration,
    sendConfirmationLinkOnPasswordChange: sendConfirmationLinkOnPasswordChange,
    sendConfirmationLinkOnForgotPassword: sendConfirmationLinkOnForgotPassword
}
