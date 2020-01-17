const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Physiotherapest = require('../models/Physiotherapests.js');
const config = require("./database");

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        Physiotherapest.getUserByEmail(jwt_payload.data.email, (err, physio) =>{
            if(err){
                return done(err, false);
            }

            if(physio){
                return done(null, physio);
            } else{
                return done(null, false);
            }
        });
    }));
}