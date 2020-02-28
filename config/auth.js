module.exports = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please login to view dashboard page.");
  res.redirect("/auth/login");

}
