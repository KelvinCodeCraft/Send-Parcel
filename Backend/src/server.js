require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')

const app = express()
const port = 5000
app.use(cors())

console.log('Server reached');

app.post('/checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Parcel',
                        },
                        unit_amount: 200 * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html',
            cancel_url: 'http://localhost:5500/cancel.html',
        });

        res.json({ url: session.url }); // Send session URL to frontend
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(`${port}`, () => console.log(`Listening on port ${port}`)
)