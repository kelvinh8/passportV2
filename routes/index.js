const router = require("express").Router();
const isAuth = require("../config/auth");
router.get("/",(req,res)=>{
  res.render("home");
})
router.get("/dashboard",isAuth,(req,res)=>{
  res.render("dashboard",{user:req.user.name});
})
module.exports = router;
