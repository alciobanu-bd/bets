
configModule.config([
'$translateProvider',
function ($translateProvider) {
    $translateProvider.translations('en', {
        header: {
            logged: {
                home: 'Home',
                play: 'Play',
                ranking: 'Ranking',
                rules: 'Rules',
                place: 'Place',
                points: 'Points',
                myProfile: 'My Profile',
                changePassword: 'Change Password',
                adminPanel: 'Admin Panel',
                history: 'History',
                logout: 'Logout'
            },
            notLogged: {
                home: 'Home',
                register: 'Register',
                login: 'Come on in'
            }
        },
        homePage: {
            logged: {
                welcome: 'Welcome'
            },
            notLogged: {
                welcome: 'Welcome to CanIHazBets! Join the fun. Register now.'
            }
        },
        loginPage: {
            name: 'Login',
            forgotPassword: 'Forgot password',
            username: 'Username',
            password: 'Password',
            keepMeLoggedInFor: 'Keep me logged in for',
            days: 'days',
            loginButton: 'Come on in'
        },
        registerPage: {
            name: 'Create a new account',
            username: 'Username',
            password: 'Password',
            confirmPassword: 'Confirm password',
            email: 'E-mail',
            birthDate: 'Birth date',
            registerButton: 'Register'
        },
        forgotPasswordPage: {
            name: 'Forgot password',
            insertIndications: 'Insert your username or e-mail to recover your forgotten password.',
            usernameOrEmail: 'Username or e-mail',
            recover: 'Recover',
            yes: 'Yes',
            no: 'No'
        },
        resetPasswordPage: {
            name: 'Reset password',
            insertIndications: 'Please insert your new password and confirm it.',
            receivedResetCode: 'Reset code received on e-mail',
            newPassword: 'New password',
            confirmPassword: 'Confirm password',
            changePassword: 'Change password',
            yes: 'Yes',
            no: 'No'
        }
    });
    $translateProvider.translations('ro', {
        header: {
            logged: {
                home: 'Acasă',
                play: 'Joacă',
                ranking: 'Clasament',
                rules: 'Reguli',
                place: 'Loc',
                points: 'Puncte',
                myProfile: 'Profilul meu',
                changePassword: 'Schimbă parola',
                adminPanel: 'Panou admin',
                history: 'Istoric',
                logout: 'Delogare'
            },
            notLogged: {
                home: 'Acasă',
                register: 'Înregistrare',
                login: 'Loghează-te'
            }
        },
        homePage: {
            logged: {
                welcome: 'Bun venit'
            },
            notLogged: {
                welcome: 'Bine ai venit pe CanIHazBets! Alătură-te distracției. Înregistrează-te acum.'
            }
        },
        loginPage: {
            name: 'Logare',
            forgotPassword: 'Ai uitat parola?',
            username: 'Nume de utilizator',
            password: 'Parolă',
            keepMeLoggedInFor: 'Păstrează-mă logat pentru',
            days: 'zile',
            loginButton: 'Loghează-mă'
        },
        registerPage: {
            name: 'Creează-ți un cont nou',
            username: 'Nume de utilizator',
            password: 'Parolă',
            confirmPassword: 'Confirmă parola',
            email: 'E-mail',
            birthDate: 'Dată de naștere',
            registerButton: 'Înregistrare'
        },
        forgotPasswordPage: {
            name: 'Parolă uitată',
            insertIndications: 'Introduceți numele de utilizator sau e-mail-ul pentru a vă recupera parola uitată.',
            usernameOrEmail: 'Nume de utilizator sau e-mail',
            recover: 'Recuperează',
            yes: 'Da',
            no: 'Nu'
        },
        resetPasswordPage: {
            name: 'Resetare parolă',
            insertIndications: 'Vă rugăm introduceți noua parolă și confirmați-o.',
            receivedResetCode: 'Codul de resetare primit prin e-mail',
            newPassword: 'Parola nouă',
            confirmPassword: 'Confirmă parola',
            changePassword: 'Schimbă parola',
            yes: 'Da',
            no: 'Nu'
        }
    });
    $translateProvider.preferredLanguage('ro');
}]);
