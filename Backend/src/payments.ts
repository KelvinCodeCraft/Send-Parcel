import { Request, Response } from 'express';
import Stripe from 'stripe';
import db from './Databasehelper/db-connection';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-01-27.acacia',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { parcelId } = req.body;

        // Fetch the parcel details from the database
        const result = await db.exec("getParcelById", { id: parcelId });
        if (!result[0]) {
            res.status(404).json({ message: "Parcel Not Found" });
        }

        const parcel = result[0];
        const price = parcel.price * 100; // Convert price to cents

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Parcel Delivery',
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5500/success.html',
            cancel_url: 'http://localhost:5500/cancel.html',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: (error as Error).message });
    }
};