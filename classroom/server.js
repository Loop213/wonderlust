
//npm i cookie-parser
const express = require("express");
const app = express();
// const user = require("./routes/user.js");
// const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


const sessionOption = {
    secret :"My superSecret",
    resave : false,
    saveUninitialized:true,
};
const flash= require("connect-flash");

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})
app.get("/register",(req,res)=>{
    let {name= "Hidden Boy" }= req.query;
    req.session.name = name;
    if(name === "Hidden Boy"){
        req.flash("error","Please provide a name");
    }else {
        req.flash("success","user registered successfully");
    }
    // res.send(name);
    res.redirect("/welcome");
});

app.get("/welcome",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
})

 
app.use("/test",(req,res)=>{
    res.send("test was successfuly completed");
});
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
});


// app.use(cookieParser("secretCode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("greet","Vivek_Singh",{signed:true});
//     res.send("signed Coookies sent");
// });

// app.get("/verified",(req,res)=>{
//     console.log(req.signedCookies);    // req.Cookies == unsigned cookies was sent.  && req.signedCookies == signed cookies was sent.
//     res.send("Verified Cookies sent");
// })



// app.get("/greet",(req,res)=>{
//     let {name}= req.cookies;
//     if(name){
//         res.send(`Welcome back ${name}`);
//     }else{
//         res.cookie("name",$(name="Vivek Singh"));
//         res.send("Hello, I am a new user");
//     }
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","Vivek_Singh");
//     res.send("you send Some Cookies");
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies); 
//     res.send("Hello, I am the Root");
// });

// // app.use("/user",user);
// // app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("Server is listing on the port 3000");
});