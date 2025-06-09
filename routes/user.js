const express=require("express");
const { use } = require("passport");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { route } = require("./listing");
const router = express.Router();
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup));

//login route
router.route("/login")
   .get(userController.loginForm)
   .post(saveRedirectUrl,
     passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
     userController.login);
//logout route
router.get("/logout",userController.logout);
module.exports=router;