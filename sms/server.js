const express = require('express');
const dotenv = require("dotenv");
const smsRoute = require("./sendSMS"); // Corrected import
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", smsRoute);

// Start the server after defining routes
app.listen(port, () => console.log(`SMS server running on port: ${port}`));
