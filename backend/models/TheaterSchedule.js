const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const scheduleSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true,
    },
    schedules: [
        {
            theater: {
                type: String,
                enum: ["1","2","3","4","5","6","7","8"],
                required: true,
            },
            movieId: {
                type: String,
                required: true,
            },
            startTime: {
                type: Date,
                required: true,
            },
            remarks: {
                type: String,
                required: false,
            },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("TheaterSchedule", scheduleSchema);