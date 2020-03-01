require("dotenv").config();
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User");

module.exports = function(passport){
  passport.use(new GitHubStrategy({
    clientID:process.env.GITHUB_CLIENT_ID,
    clientSecret:process.env.GITHUB_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/github/redirect"
  },(accessToken,refreshToken,profile,cb)=>{
    console.log(profile);
    User.findOne({githubId:profile.id},(err,currentUser)=>{
      if(currentUser){
          return cb(err,currentUser);
      }
      if(!currentUser){
        new User({
          name:profile.username,
          githubId:profile.id
        }).save((err,newUser)=>{
          return cb(err,newUser);
        })
      }
    })
  }))
}
