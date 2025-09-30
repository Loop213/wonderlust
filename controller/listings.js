const Listing = require("../models/listing");



module.exports.index = async(req, res) => {
  const allListings = await Listing.find({});
  res.render("index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new");
};

module.exports.createNewListing = async(req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, filename);
  const newListing = new Listing(req.body.listing); // ✅ use nested object
  newListing.owner = req.user._id; // ✅ associate listing with logged-in user

  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success","Successfully made a new Listing");
  res.redirect("/listings");
};

module.exports.showListing = async(req, res) => {
  const listing = await Listing.findById(req.params.id)
  .populate({path:"reviews",
    populate:{ path:"author"
  }}).populate("owner");

  if(!Listing){
    req.flash("error","Cannot find that Listing");
    return res.redirect("/listings");
  }
  res.render("show", { listing });
};

module.exports.renderEditForm = async(req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("edit", { listing });
};

module.exports.updateListing = async(req, res) => {
  let{id}=req.params;
  let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing });

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }

  req.flash("success","Successfully updated Listing");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async(req, res) => {
  let{id}=req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Successfully deleted Listing");
  res.redirect("/listings");
};  


