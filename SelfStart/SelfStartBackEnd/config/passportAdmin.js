const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Administrators = require('../models/Administrators');
const config = require("./database");

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        Administrators.getUserByEmail(jwt_payload.data.email, (err, admin) =>{
            if(err){
                return done(err, false);
            }

            if(admin){
                return done(null, admin);
            } else{
                return done(null, false);
            }
        });
    }));
}