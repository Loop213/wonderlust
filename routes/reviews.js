const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");

const reviewController = require("../controller/reviews.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const reviews = require("../routes/reviews.js"); // REMOVED: Redundant require
const { validatedReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");




// CORRECTED: Create new review for a listing
router.post("/",isLoggedIn, validatedReview, wrapAsync(reviewController.createReview));


// Delete a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;