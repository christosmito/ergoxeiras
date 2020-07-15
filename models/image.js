const mongoose = require("mongoose");

const image = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Image", image);