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



const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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
//validation for schema


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found !"));
});
app.use((err, req, res, next ) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
}); 




app.listen(port,(res)=>{
    console.log("port is listing");
});