const express = require('express');
const dotenv = require("dotenv");
const smsRoute = require("./sendSMS"); 
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = 7000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", smsRoute);

// Start the server after defining routes
app.listen(port, () => console.log(`SMS server running on port: ${port}`));
