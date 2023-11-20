const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const indexRoutes = require("./Routes/indexRoutes");
const userRoutes = require("./Routes/userRoutes");

const globalErrorHandler = require("./Controllers/errorControllers");

const app = express();

// ===== Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// ======== Data sanitization against XSS (protection from malicious html) use pkg name exactly "xss-clean"
app.use(xssClean());
//  Set Security HTTP Headers======
app.use(helmet());

app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// Routes
app.use("/user", userRoutes);

app.use("", indexRoutes);

// // Handling unhandled routes:
app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: 404,
    success: false,
    message: `can't find ${req.originalUrl} on this server`,
    data: {},
  });
});

// Error handler middlware
app.use(globalErrorHandler);

module.exports = app;
