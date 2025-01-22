const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    image:{
        type: Buffer,
        required: false
    },
    rating:{
        type: String,
        enum: ["g", "pg12", "r15", "r18"],
        default: "g"
    },
    showingType:{
        type: [String],
        default: []
    }, 
}, {
    timestamps: true
});

module.exports = mongoose.model("Movie", movieSchema);