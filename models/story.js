const mongoose = require("mongoose");

//Story Schema
let storySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Story = module.exports = mongoose.model("Story", storySchema);