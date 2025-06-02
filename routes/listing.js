const express=require("express");
const { model } = require("mongoose");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review=require("../models/review.js");

//validation for schema
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    };
};

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     };
// };
//index route
router.get("/", async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// create route
router.post("/",validateListing, wrapAsync( async(req,res,next)=>{
   

    let listing=req.body.listing;
    const newListing=new Listing(listing);
   
    await newListing.save();
    res.redirect("/listings");  

   
}
));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send vaild data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));
// //review 
// //post route


// router.post("/:id/review",validateReview,wrapAsync( async (req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
  
//     res.redirect(`/listings/${listing.id}`);
// }));

// //delete reciew route
// router.delete("/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));

module.exports=router;