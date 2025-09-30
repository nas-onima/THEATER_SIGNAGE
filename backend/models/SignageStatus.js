const mongoose = require("mongoose");

const signageStatusSchema = new mongoose.Schema({
    theaterId: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
        default: null
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    movieId: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SignageStatus", signageStatusSchema); 