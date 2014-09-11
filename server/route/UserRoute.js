
// NOTE that app is defined globally

var User = require('./../model/User.js');
var Roles = require('./../model/Roles.js');
var jwtauth = require('./../middlewares/jwtauth.js');
var tokenChecks = require('./../middlewares/tokenChecks.js');

User
    .methods(['get', 'post', 'put', 'delete'])
    .before('post', function (req, res, next) {
        // be sure these fields are saved
        req.body.registerDate = new Date();
        req.body.points = 0;
        req.body.place = -1;
        req.body.role = Roles.user.name;
        next();
    })
    // only admins are permitted to see all existing users, gets on a specific user are permitted for all users
    .before('get', jwtauth([tokenChecks.hasRoleWithoutId('ROLE_ADMIN'), tokenChecks.hasRoleWithId('ROLE_USER')]))
    .before('put', jwtauth([tokenChecks.hasSameIdOrHasRole('ROLE_ADMIN')]))
    .before('delete', jwtauth([tokenChecks.hasRole('ROLE_ADMIN')]))
    .route('rm-rf.delete', {
        handler: function(req, res, next) {
            User.remove({}, /*jwtauth([tokenChecks.hasRole('ROLE_SUPERUSER')]),*/ function(err) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        message: "An error has occured."
                    });
                }
                else{
                    res.json({
                        message: "Success."
                    });
                    console.log('User collection removed');
                }
            });
        }
    });

User.register(app, '/api/user');
