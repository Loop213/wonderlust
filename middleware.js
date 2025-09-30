const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const flash = require("connect-flash");


module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    //after login redirect original page 
    req.session.redirectUrl= req.originalUrl;
    req.flash("error","You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

//after login redirect original page 
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req,res,next)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing.owner.equals(req.user._id)){
    req.flash("error","You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// Validate listing middleware
module.exports.validatedListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// Validate review middleware
module.exports.validatedReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // {convert: true} is default
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// Check if the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};