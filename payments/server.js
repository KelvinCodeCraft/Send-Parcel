<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const port = 3200;
=======
require('dotenv').config()
const express = require('express')
const stripe = require('stripe')('sk_test_51PeF6KFmkmpt7fOZOwbJx9hHJoqA2IAaN2RQzsRHJZROfGbvXX0stRhlVr0pUJ6BG9YHEtpnYxn5o8d05dbkofE200DqFwSS8I')
const cors = require('cors')

const app = express()
const port = 3000
app.use(express.json());
// app.use(cors())
app.use(
    cors({
      origin: "*", 
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
>>>>>>> bfedf8e9251bfeee63285f9f321cd693c7fe0f51

app.use(cors());
app.use(express.json()); // Ensure JSON parsing

console.log("Payment server running on port", port);

app.post('/create-checkout-session', async (req, res) => {
    try {
<<<<<<< HEAD
        const { price } = req.body; // Get price from request

        if (!price || price <= 0) {
            return res.status(400).json({ error: "Invalid price" });
        }

=======
        console.log(req.body);
        
>>>>>>> bfedf8e9251bfeee63285f9f321cd693c7fe0f51
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
<<<<<<< HEAD
                        product_data: { name: 'Parcel' },
                        unit_amount: price, // Use the price from parcel API
=======
                        product_data: {
                            name: 'Parcel',
                        },
                        unit_amount: req.body.unit_amount * 100, 
>>>>>>> bfedf8e9251bfeee63285f9f321cd693c7fe0f51
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html',
            cancel_url: 'http://localhost:5500/cancel.html',
        });

        console.log("Checkout session created:", session.url);
        res.json({ url: session.url });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
