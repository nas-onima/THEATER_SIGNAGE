const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const schedulesRoute = require("./routes/users");
const moviesRoute = require("./routes/users");

dotenv.config();

const app = express();

//middleware
app.use(express.json);
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/schedules", schedulesRoute);
app.use("/api/auth", authRoute);


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})