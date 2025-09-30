if(process.env.NODE_ENV!=="production"){
  require("dotenv").config();
};

const DB_URL = process.env.DB_ATLAS_URL;
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const listingRoute = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");

const userRoute = require("./routes/user.js");


const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

const store = MongoStore.create({
  mongoUrl:DB_URL,
  touchAfter: 24*60*60,
  crypto:{
    secret:process.env.SECRET_KEY,
  }
});

store.on("error",function(e){
  console.log("SESSION STORE ERROR",e); 
});

const sessionOptions = {
  store:store,
  secret:process.env.SECRET_KEY,
  resave :false,
  saveUtilinitialized:true,
  cookie:{
    expire:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }, 
};



//const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";



mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,   // force SSL
  tls: true,   // TLS handshake
})
.then(() => console.log("✅ Connected to DB"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);


app.use(session(sessionOptions)); //before /listings routes
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());      // new tab then also logged in my account (session ko store karke rakhta haii ) 
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});



app.use("/demouser",async(req,res)=>{
  const demoUser = new User({
    email:"amitkumarsingh@gmail.com",
    username:"amit2103",
  });
  const newUser = await User.register(demoUser,"helloworld");
  res.send(newUser);
}); 




// Routes
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRoute);



// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log("Server is listening on port 8080");
});


