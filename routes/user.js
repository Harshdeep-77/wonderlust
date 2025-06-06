const express=require("express");
const { use } = require("passport");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { route } = require("./listing");
const router = express.Router();
const passport=require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
 try{
    let {username,email,password}=req.body;
   const newUser=new User({username,email});
   const registerUser=await User.register(newUser,password);
   console.log(registerUser);
   req.flash("success","welcome to Yaatra");
   res.redirect("/listings");
 }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
 }
   
}
));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
     passport.authenticate('local', { failureRedirect: '/login',failureFlash:true })
,async(req,res)=>{
req.flash("success","Welcome back to Yaatra");
res.redirect("/listings");
});
module.exports=router;