//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app =express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltrounds = 10;
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose setup
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

// ENCRYPTION USING MONGOOSE-ENCRYPTION
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, {secret : secret, encryptedFields : ["password"]});



const User = mongoose.model("User",userSchema);

//Render Home Page
app.get("/", function(req,res){
  res.render("home");
});
//Login
app.get("/login", function(req,res){
  res.render("login");
});
//Register
app.get("/register", function(req,res){
  res.render("register");
});

//Saving username and password to the database Post of Register ( mongoose )
app.post("/register", function(req,res){
  bcrypt.hash(req.body.password, saltrounds, function(err, hash){
    const user = new User({
      email: req.body.username,
      password: hash
      // password: md5(req.body.password)
    });
  user.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
  console.log(err);
    }
  });
  })

});

app.post("/login", function(req,res){
const username = req.body.username;
const password = req.body.password;
// const password = md5(req.body.password);
User.findOne({email : username}, function(err,foundUser){
if(err){
  console.log(err);
}
else if(foundUser){
  bcrypt.compare(password,foundUser.password, function(err, result){
    if(result === true){
      res.render("secrets");
    }
  });
}
})
})





app.listen(3000, function(){
  console.log("successfully connected you see");
})
