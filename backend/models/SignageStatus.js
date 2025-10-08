const mongoose = require("mongoose");

const signageStatusSchema = new mongoose.Schema({
    theaterId: {
        type: String,
        required: true,
    },
    socketIds: {
        type: [String],
        default: []
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    activeConnections: {
        type: Number,
        default: 0
    },
    lastConnectedAt: {
        type: Date,
        default: null
    },
    movieId: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    titleOverride: {
        type: String,
        default: null,
    },
    showingType: {
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