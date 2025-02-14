const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    rating: {
        type: String,
        enum: ["", "G", "PG12", "R15+", "R18+"],
        default: ""
    },
    showingType: {
        type: [String],
        default: [],
    },
    releaseDate: {
        type: Date,
        required: true,

    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Movie", movieSchema);