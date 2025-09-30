const Joi = require("joi");

// Correct Joi schema for validation
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),

    // Use Joi.alternatives() to allow either an object or a string
    image: Joi.alternatives().try(
        Joi.object({
            url: Joi.string().uri().allow(""),
            filename: Joi.string().allow("")
        }),
        Joi.string().allow("") // Allows a string (for the existing URL)
    ).optional(), // Make the whole image field optional or allow empty

    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required()
  }).required()
});


// Review schema
const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().integer().required().min(1).max(5),
    author: Joi.string() // Optional: Include author if needed
  }).required()
});


// ✅ Export after both are defined
module.exports = { listingSchema, reviewSchema };
