const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    rating:{
        type: String,
        enum: ["g", "pg12", "r15", "r18"],
        default: "g"
    },
    showingType:{
        type: [String],
        default: [],
    }, 
    releaseDate:{
        type: Date,
        required: true,
        
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Movie", movieSchema);