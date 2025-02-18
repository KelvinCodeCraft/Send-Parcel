import { Request, Response } from "express";
import Stripe from "stripe";
import db from '../Databasehelper/db-connection';
 // Ensure this is your DB connection
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia",
});

// **Create Stripe Checkout Session**
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { price, parcelData } = req.body;  // Get parcel data from frontend

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Parcel Delivery" },
                        unit_amount: parseInt(price) * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
            metadata: parcelData // Attach parcel data to session
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ message: "Error creating checkout session", error });
    }
};
