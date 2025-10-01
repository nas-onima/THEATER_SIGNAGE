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
    },
    titleOverride:{
        type: String,
        default: null,
    },
    showingType:{
        type: Object,
        default: {
            sub: false,
            dub: false,
            jsub: false,
            fourK: false,
            threeD: false,
            cheer: false,
            live: false,
            greeting: false,
            greetingLive: false,
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SignageStatus", signageStatusSchema); 