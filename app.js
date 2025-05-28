const express=require("express");
const mongoose=require("mongoose");
const port=7000;
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./schema.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
.then(() => console.log("connected to dbs"))
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.get("/",(req,res)=>{
    console.log("home done");
    res.send("working");
});
//index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// create route
app.post("/listings",wrapAsync( async(req,res,next)=>{
   
    const result=listingSchema.validate(req.body);

    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    let listing=req.body.listing;
    const newListing=new Listing(listing);
   
    await newListing.save();
    res.redirect("/listings");  

   
}
));

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send vaild data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found !"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
}); 

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="something went wrong"}=err;
//     res.render("error.ejs",{message});
//     //  res.status(statusCode).send(message);

// });
app.listen(port,(res)=>{
    console.log("port is listing");
});