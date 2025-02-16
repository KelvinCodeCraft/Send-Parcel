const express = require("express");
const router = express.Router();
require('dotenv').config();

const credentials = {
    apiKey: 'atsk_435bff255cbae11780d1945ea99fcbbff1712856a62cf8afedfef94f064ac4fdbcb78b7b', 
    username: 'senditparcel'  
};

const AfricasTalking = require("africastalking")(credentials);
const sms = AfricasTalking.SMS;

router.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Phone number or message not provided" });
    }

    const options = {
        to: to,
        message: message,
        enqueue: true
    };

    sms.send(options)
        .then(response => {
            console.log("SMS Response:", JSON.stringify(response, null, 2));
            res.json(response); // Send response to client
        })
        .catch(error => {
            console.error("SMS Error:", error);
            res.status(500).json({ error: "Failed to send SMS", details: error });
        });
});

module.exports = router;


// function sendMessage() {
//     const options = {
//         to: ['+254769777397', '+254751335348'],
//         message: "Test sms from Ivonne",
//         enque: true
//     }

//     sms.send(options)
//         .then(response => console.log("SMS Response:", JSON.stringify(response, null, 2)))
//         .catch(error => console.error("SMS Error:", error));
// }

// sendMessage();