const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
//Register page
router.get("/register",(req,res)=>{
  if(!req.isAuthenticated()){
      res.render("register")
  }else{
    res.redirect("/dashboard");
  }
})
//Login page
router.get("/login",(req,res)=>{
  if(!req.isAuthenticated()){
      res.render("login");
  }else{
    res.redirect("/dashboard");
  }
})
//Register handler
router.post("/register",(req,res)=>{
  const {name,email,password,password2} = req.body;
  let errors = [];

  //Check required fields
  if(!name || !email || !password || !password2){
    errors.push({msg:"Please fill in all fields"});
  }
  //Check passwords match
  if(password !== password2){
    errors.push({msg:"Passwords do not match"});
  }
  //Check pass length
  if(password.length < 6){
    errors.push({msg:"Password should be at least 6 characters"});
  }

  if(errors.length > 0){
    res.render("register",{name,email,password,password2,errors});
  }else{
    User.findOne({email:email},(err,foundUser)=>{
      if(!err){
        if(foundUser){
          errors.push({msg:"Email already exist"})
          res.render("register",{errors});
        }else{
          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
              const newUser = new User({
                name,
                email,
                password : hash
              });
              newUser.save().then((newUser)=>{
                req.flash("success_msg","Successfully registered");
                res.redirect("/auth/login")
              });
            })
          })
        }
      }
    })
  }

})
//Login handler
router.post("/login",(req,res,next)=>{
  passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/auth/login",
    failureFlash:true
  })(req,res,next);
})
//Logout handler
router.get("/logout",(req,res,next)=>{
  req.logout();
  req.flash("success_msg","Successfully logged out.")
  res.redirect("/auth/login");
})
//Login with google handler
router.get("/google",passport.authenticate("google",{scope:["profile"]}));
//google redirect handler
router.get("/google/redirect",passport.authenticate("google",
{failureRedirect:"auth/login",
successRedirect:"/dashboard"}
));
//GitHub handler
router.get("/github",passport.authenticate("github"));
router.get("/github/redirect",passport.authenticate("github",{
  successRedirect:"/dashboard",
  failureRedirect:"/auth/login"
}));

module.exports = router;
