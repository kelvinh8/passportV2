const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = require("../models/User");

const bcrypt = require("bcrypt");

module.exports = function(passport){
  passport.use(new LocalStrategy({
    usernameField: 'email'
  },(email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
      if(err){
        return done(err);
      }
      if(!user){
        return done(null,false,{message:"That email is not registered."});
      }

      if(user){
        bcrypt.compare(password,user.password,(error,result)=>{
          if(!result){
            return done(null,false,{message:"Incorrect password."})
          }
          return done(null,user);
        })
      }
    })

  }))

}
