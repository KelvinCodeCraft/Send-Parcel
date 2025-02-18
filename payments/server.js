require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const port = 3200;

app.use(cors());
app.use(express.json()); // Ensure JSON parsing

console.log("Payment server running on port", port);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { price } = req.body; // Get price from request

        if (!price || price <= 0) {
            return res.status(400).json({ error: "Invalid price" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Parcel' },
                        unit_amount: price, // Use the price from parcel API
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
