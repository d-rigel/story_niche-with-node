//Bring in express
const express = require("express");
//init path
const path = require("path");
//init mongoose
const mongoose = require("mongoose");
//Init express Validator
const expressValidator = require("express-validator")
//Init flash
const flash = require("connect-flash");
const passport = require("passport")
//Init session
const session = require("express-session");
//passport config file
const config = require("./config/database")

//connect mongodb
// mongoose.connect("mongodb://localhost/storyniche");
mongoose.connect(config.database)

let db = mongoose.connection;



//Check connection
db.once("open", () => {
    console.log("connected to mongoDb")
})

//Check for DB errors
db.on("error", (err) => {
    console.log(err)
})

//Init app
const app = express();




//Bring in model
let Story = require("./models/story")

//load view engine
app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'pug')

/*To allow us handle raw json data */
app.use(express.json());

/*To allow us handle form submissions/ handle url encoded data */
app.use(express.urlencoded({ extended: false}));

//Express Session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,  
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator())

//passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

//Global url
app.get("*", (req, res, next) => {
    //setting a global variable for logout
    res.locals.user = req.user || null;
    next()
});



//Set public folder
app.use(express.static(path.join(__dirname, "public")));



//Home route
app.get("/", (req, res) => {

    Story.find({}, (err, stories) => {
        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                title: "Stories",
                stories: stories
                
            })  
        }
    })

     
})


//Set routes
let stories = require("./routes/stories");
app.use("/stories", stories);

//Set users route
let users = require("./routes/users");
// const passport = require("./config/passport");
app.use("/users", users);


//set dynamic port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server started at http//localhost:${PORT}`)
} )