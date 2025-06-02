const mongoose = require("mongoose");
const { type } = require("../schema");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename:String,
        url:{
        type: String,
        default:"https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
        set: (v) => v === "" ? "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]    
});
//mongosse middleware ,delete review weith listings
listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
}
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;