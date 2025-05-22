const express=require("express");
const mongoose=require("mongoose");
const port=7000;
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate")
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
//create route
app.post("/listings",async(req,res)=>{
    let listing=req.body.listing;
    let newListing=new Listing(listing);
    await newListing.save();
    res.redirect("/listings")
})
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//edi{t route
app.get("/listings/:id/edit",async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"this is great",
//         price:7000,
//         location:"haryana",
//         country:"india"
//     });
//    await sampleListing.save();
//    console.log("samle testing");
//    res.send("testing");
// });

// app.listen(port,(res)=>{
//     console.log("port is listing");
// });
app.listen(port,(res)=>{
    console.log("port is listing");
});