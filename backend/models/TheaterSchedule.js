const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const scheduleSchema = new mongoose.Schema({
    theaterName: {
        type: String,
        required: true,
    },
    schedule: [
        {
            movieId: {
                type: String,
                required: true
            },

            mainStartTime: {
                type: Date,
                required: true
            },
            mainEndTime: {
                type: Date,
                required: true
            },
            remarks: {
                type: String,
                required: false
            },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("TheaterSchedule", scheduleSchema);