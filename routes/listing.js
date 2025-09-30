

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validatedListing } = require("../middleware.js");
const path = require("path");
const multer = require("multer"); // Import multer for handling file uploads
const {storage} = require("../cloudConfig"); // Import cloudinary configuration
//const uploads = multer({ dest:"uploads/"}); // store files locally
const uploads = multer({ storage});  // file uploading to cloudinary


const listingController = require("../controller/listings.js");


// Form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/")
.get( wrapAsync(listingController.index)) //show all listings
.post(isLoggedIn, validatedListing,uploads.single("listing[image]"),
 wrapAsync(listingController.createNewListing)); //create new listing

router
.route("/:id")
.get(wrapAsync(listingController.showListing)) //show listing details
.put(isLoggedIn,isOwner,validatedListing,
    uploads.single("listing[image]"), 
    wrapAsync(listingController.updateListing)) //update listing
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



// Form to edit listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
