const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Client = require("../models/PatientProfiles");
const config = require("./database");

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        Client.getUserByEmail(jwt_payload.data.email, (err, client) =>{
            if(err){
                return done(err, false);
            }

            if(client){
                return done(null, client);
            } else{
                return done(null, false);
            }
        });
    }));
}