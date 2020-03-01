require('dotenv').config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function(passport){
  passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/redirect"
  },(accessToken,refreshToken,profile,cb)=>{
    User.findOne({googleId:profile.id},(err,currentUser)=>{
      if(currentUser){
        return cb(err,currentUser);
      }
      if(!currentUser){
        new User({
          name:profile.displayName,
          googleId:profile.id
        }).save((err,newUser)=>{
          return cb(err,newUser);
        })
      }


    })
  }))
  
}
