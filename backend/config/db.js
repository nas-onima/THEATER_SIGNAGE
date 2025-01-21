const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Ready...");
    } catch (e){
        console.error(e.message);
        process.exit(1);
    }
};

module.exports = connectDB;