const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");
//static to public folder
app.use(express.static("public"));
//grab data using req.body
app.use(express.urlencoded({extended:true}));
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
