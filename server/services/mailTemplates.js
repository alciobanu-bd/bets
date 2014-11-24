
module.exports = {
    en: {
        confirmationLinkOnRegistration: function (username, code) {
            return {
                subject: 'Registration at ' + domainName.beautifulName,
                body: 'Welcome to ' + domainName.beautifulName + ', ' +
                '\r\n\r\n' +
                'Dear ' + username + ',' +
                '\r\n' +
                'We are pleased that you registered at our site. We hope you will have a pleasant staying.' +
                '\r\n\r\n' +
                'In order to activate your account, use the next code after you login: ' +
                '\r\n' +
                code
            };
        },
        resendConfirmationLink: function (username, code) {
            return {
                subject: 'Activation at ' + domainName.beautifulName,
                body: 'Dear ' + username + ',' +
                '\r\n\r\n' +
                'You recently requested a new activation code for your account.' +
                '\r\n' +
                'You can use this one right after you login to your account: ' +
                '\r\n' +
                code
            };
        },
        confirmationLinkOnPasswordChange: function (username, code) {
            return {
                subject: 'Changed password at ' + domainName.beautifulName,
                body: 'Dear ' + username + ',' +
                '\r\n' +
                'We detected that you recently changed your password.' +
                '\r\n\r\n' +
                'In order to re-activate your account after change, login on site and use the next code:' +
                '\r\n' +
                code
            };
        },
        confirmationLinkOnForgotPassword: function (username, code) {
            return {
                subject: 'Password reset at ' + domainName.beautifulName,
                body: 'Dear ' + username + ',' +
                '\r\n' +
                'You recently required a code to reset your password.' +
                '\r\n\r\n' +
                'In order to change your password, use the next link:' +
                '\r\n' +
                domainName.address + "/#/reset-password/" + code +
                '\r\n\r\n' +
                'If the link doesn\'t work, please go to ' + domainName.address + "/#/reset-password" +
                ' and copy and paste the following code:' +
                '\r\n' + code
            };
        },
        notificationAboutANewWeek: function (username, week, endDate, events) {
            return {
                subject: 'New week at ' + domainName.beautifulName,
                body: 'Dear ' + username + ',' +
                '\r\n' +
                'We are happy to announce you that a new week (#' + week.number + ') is available on ' +
                domainName.beautifulName + '.' +
                '\r\n\r\n' +
                'The matches we selected for this week are: ' +
                '\r\n\r\n' + events +
                '\r\n\r\n' +
                'The deadline since you can guess the scores is ' +
                endDate.split("T")[0] + ' ' + endDate.split("T")[1].split(":")[0] + ':' +
                endDate.split("T")[1].split(":")[1] + ' (UTC). ' +
                'Don\'t miss it!' + '\r\n\r\n' +
                'If you want to unsubscribe from these e-mails, login to your account and change your preference from ' +
                'your profile page.'
            };
        },
        congratulationsToWeekWinners: function (username, bet) {
            return {
                subject: 'Winner at ' + domainName.beautifulName,
                body: 'Dear ' + username + ',' +
                '\r\n\r\n' +
                'We would like to congratulate you for winning week #' +
                bet.weekNumber +
                ' at ' + domainName.beautifulName + ',' +
                ' scoring ' + bet.points + ' points.' +
                '\r\n' +
                'Keep it up and don\'t miss the next week!' +
                '\r\n\r\n' +
                'If you want to unsubscribe from these e-mails, login to your account and change your preference from ' +
                'your profile page.' +
                '\r\n'
            };
        }
    },

    ro: {
        confirmationLinkOnRegistration: function (username, code) {
            return {
                subject: 'Înregistrare la ' + domainName.beautifulName,
                body: 'Bine ai venit pe ' + domainName.beautifulName + ', ' +
                '\r\n\r\n' +
                'Salut ' + username + ',' +
                '\r\n' +
                'Ne bucurăm să te avem pe site-ul nostru. Sperăm ca timpul petrecut pe site-ul nostru să fie cât mai plăcut.' +
                '\r\n\r\n' +
                'Pentru a-ți activa contul, folosește codul următor imediat după ce te loghezi: ' +
                '\r\n' +
                code
            };
        },
        resendConfirmationLink: function (username, code) {
            return {
                subject: 'Activare la ' + domainName.beautifulName,
                body: 'Salut ' + username + ',' +
                '\r\n\r\n' +
                'Ai cerut recent un nou cod de activare pentru contul tău.' +
                '\r\n' +
                'Îl poți folosi pe acesta imediat după ce te loghezi: ' +
                '\r\n' +
                code
            };
        },
        confirmationLinkOnPasswordChange: function (username, code) {
            return {
                subject: 'Schimbare parolă pe ' + domainName.beautifulName,
                body: 'Salut ' + username + ',' +
                '\r\n' +
                'Am observat că ți-ai schimbat parola recent.' +
                '\r\n\r\n' +
                'Pentru a-ți reactiva contul după schimbare, loghează-te pe site și folosește codul următor:' +
                '\r\n' +
                code
            };
        },
        confirmationLinkOnForgotPassword: function (username, code) {
            return {
                subject: 'Resetare parolă pe ' + domainName.beautifulName,
                body: 'Salut ' + username + ',' +
                '\r\n' +
                'Ai cerut recent un cod pentru a-ți reseta parola.' +
                '\r\n\r\n' +
                'Pentru a schimba parola, folosește link-ul următor:' +
                '\r\n' +
                domainName.address + "/#/reset-password/" + code +
                '\r\n\r\n' +
                'Dacă link-ul nu funcționează, te rugăm să mergi la adresa ' + domainName.address + "/#/reset-password" +
                ' și să copiezi de mână codul următor:' +
                '\r\n' + code
            };
        },
        notificationAboutANewWeek: function (username, week, endDate, events) {
            return {
                subject: 'Etapă nouă pe ' + domainName.beautifulName,
                body: 'Salut ' + username + ',' +
                '\r\n' +
                'Ne bucurăm să te anunțăm că o nouă etapă (#' + week.number + ') este disponibilă pe ' +
                domainName.beautifulName + '.' +
                '\r\n\r\n' +
                'Meciurile pe care le-am selectat pentru această etapă sunt: ' +
                '\r\n\r\n' + events +
                '\r\n\r\n' +
                'Termenul limită până când poți paria scorurile tale este ' +
                endDate.split("T")[0] + ' ' + endDate.split("T")[1].split(":")[0] + ':' +
                endDate.split("T")[1].split(":")[1] + ' (UTC). ' +
                'Nu rata etapa aceasta!' + '\r\n\r\n' +
                'Dacă dorești să nu mai primești aceste e-mail-uri, loghează-te în contul tău și dezactivează  ' +
                'abonarea la știrile site-ului de pe pagina profilului tău.' +
                '\r\n'
            };
        },
        congratulationsToWeekWinners: function (username, bet) {
            return {
                subject: 'Câștigător pe ' + domainName.beautifulName,
                body: 'Salut ' + username + ',' +
                '\r\n\r\n' +
                'Dorim să te felicităm pentru câștigarea etapei #' +
                bet.weekNumber +
                ' pe ' + domainName.beautifulName + '.' +
                ' Ai reușit să câștigi ' + bet.points + ' puncte, iar acestea au fost suficiente pentru victorie.' +
                ' Felicitări!' +
                '\r\n' +
                'Ține-o tot așa și nu rata următoarea etapă.' +
                '\r\n\r\n' +
                'Dacă dorești să nu mai primești aceste e-mail-uri, loghează-te în contul tău și dezactivează  ' +
                'abonarea la știrile site-ului de pe pagina profilului tău.' +
                '\r\n'
            };
        }
    }
};
