const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const morgan = require("morgan"); //for logging for dev

const path = require("path");
const connectDB = require("./config/database");

// Load config
dotenv.config({ path: "./config/config.env" });

// TODO:
// load Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const tourRoutes = require("./routes/tour");
const categoryRoutes = require("./routes/category");
const agencyRoutes = require("./routes/agency");
const bookingRoutes = require("./routes/booking");
const adminRoutes = require("./routes/admin");

// starting app
const app = express();

// database
connectDB();

// Middlewares
// app.use(bodyParser.json()); //bodyParser is used in post request to fetch data from req.body
app.use(express.json()); // replacement for body parser as body parser is deprecated
app.use(cookieParser());
app.use(cors()); // cors are used to cross origen resource share // must be added

// TODO:
// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tourRoutes);
app.use("/api", categoryRoutes);
app.use("/api", agencyRoutes);
app.use("/api", adminRoutes);
app.use("/api", bookingRoutes);

// Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// cross-env NODE_ENV=production

if (process.env.NODE_ENV === "production") {
	// set Static Folder
	app.use(express.static("frontend/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
	});
}

// Starting server
const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
