const Joi = require("joi");
// const { max, type } = require("../schema");
// const { date } = require("joi");
// const Schema = mongoose.Schema;

const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
      url: Joi.string().allow("", null)  // image.url can be string or empty
    }).required()
        
    }).required()
        
    })
   

    const reviewSchema=Joi.object({
        review:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required(),
        }).required(),
    });

module.exports={
    listingSchema,
    reviewSchema,
};