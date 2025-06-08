const express=require("express");
const { model } = require("mongoose");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");




//index route
router.get("/", async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
//new route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
// create route
router.post("/",validateListing, wrapAsync( async(req,res,next)=>{
   

    let listing=req.body.listing;
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;   
    await newListing.save();
    req.flash("success","New listings created");
    res.redirect("/listings");  

   
}
));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    };
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    };
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send vaild data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listings Updated");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","listings deleted");
  res.redirect("/listings");
}));


module.exports=router;