const { model } = require("mongoose");
const Listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.createListing=async(req,res,next)=>{
   

    let listing=req.body.listing;
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;   
    await newListing.save();
    req.flash("success","New listings created");
    res.redirect("/listings");  

   
};
module.exports.showListing=async(req,res)=>{
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
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};
module.exports.editLisitng=async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    };
    res.render("listings/edit.ejs",{listing});
};
module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send vaild data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listings Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
  req.flash("success","listings deleted");
  res.redirect("/listings");
};