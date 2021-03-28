const express = require("express");
const story = require("../models/story");
const router = express.Router();


//Bring in model
let Story = require("../models/story")
//user model
const user = require("../models/user")


//Bring in User model
let User = require("../models/user")



//Add Story
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("add_stories", {
        title: "Add Stories"
    })
})

//Add submit post route process
router.post("/add", (req, res) => {
    req.checkBody("title", "Title is required").notEmpty();
    // req.checkBody("author", "Author is required").notEmpty();
    req.checkBody("body", "Body is required").notEmpty();

    //Get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render("add_stories", {
            title: "Add Stories",
            errors: errors
        })
    } else {
        
    const story = new Story()
    story.title = req.body.title;
    // story.author = req.body.author;
    story.author = req.user._id;
    story.body = req.body.body;

    story.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash("success", "Story Added");
            res.redirect("/")
        }
    })

    }

    // console.log(story.title)
       
})


//Load Edit Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if (story.author != req.user._id) {
            req.flash("danger", "Not Authorized");
            res.redirect("/")
        }
        res.render("edit_story", {
            title: "Edit story",
            story: story
        })
    })
})

//Update Submit Post Route
router.post("/edit/:id", (req, res) => {
    let story = {}
    story.title = req.body.title
    story.author = req.body.author
    story.body = req.body.body

    let query = {_id: req.params.id}

    Story.update(query, story, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash("success", "Story Updated")
            res.redirect("/")
        }
    })
})

//Delete Story
router.delete("/:id", (req, res) => {
    if (!req.user._id) {
        res.status(500).send()
    }

    let query = {_id: req.params.id}

    Story.findById(req.params.id, function(err, story) {
        if (story.author != req.user._id) {
            res.status(500).send();
        } else {
            Story.remove(query, function(err) {
                if (err) {
                    console.log(err)
                }
                // res.send("success")
                res.send("Success")
            })
        }
    })
    

    // Story.findById(req.params.id, (req, res) => {
    //     if (story.author != user._id) {
    //         res.status(500).send();
    //     } else {
    //         Story.remove(query, (err) => {
    //             if (err) {
    //                 console.log(err)
    //             } 
    //             res.send("success");
            
    //         })
    //     }
    // })
    
} )

//moved from above
//Get Single story
router.get("/:id", (req, res) => {
    Story.findById(req.params.id, (err, story) => {
        User.findById(story.author, (err, user, name) => {
            res.render("story", {
                story: story,
                author: user.name
            })
        })
        
    })
})

//Access control function
function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("danger", "Please longin");
        res.redirect("/users/login")
    }
}

module.exports = router;
