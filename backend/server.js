const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const schedulesRoute = require("./routes/schedules");
const moviesRoute = require("./routes/movies");
const signageRoute = require("./routes/signage");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/schedules", schedulesRoute);
app.use("/api/auth", authRoute);
app.use("/api/signages", signageRoute);

//connect to DB and start server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
})