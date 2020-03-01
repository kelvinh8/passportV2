const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportConfig = require("./config/passport")(passport);
const passportGoogle = require("./config/passportGoogle")(passport);
const User = require("./models/User");

const app = express();
app.set("view engine","ejs");
//static to public folder
app.use(express.static("public"));
//grab data using req.body
app.use(express.urlencoded({extended:true}));
//using cookie cookieParser
app.use(cookieParser());
//using session
app.use(session({
  secret:"secret",
  saveUninitialized:true,
  resave:true
}));
//initialize passport with session
app.use(passport.initialize());
app.use(passport.session());
//serialize user into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//using flash
app.use(flash());
//Global variable
app.use("/",(req,res,next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  next();
});
//localhost:3000/
app.use("/",require("./routes/index"));
//localhost:3000/auth/
app.use("/auth",require("./routes/authRoutes"));
//connecting app.js to mongodb server
mongoose.connect("mongodb://localhost:27017/userDB3",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
  console.log("Connected to mongodb")
});

//app is listening on port 3000
app.listen("3000",()=>{
  console.log("Server started on port 3000")
})
