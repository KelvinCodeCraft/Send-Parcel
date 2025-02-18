import { Request, Response } from "express";
import Stripe from "stripe";
import db from '../Databasehelper/db-connection';
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-01-27.acacia",
});

// **Stripe Webhook - Only save parcel if payment is successful**
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        res.status(400).json({ error: "Invalid webhook signature" });
        return;
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (!session.metadata) {
            console.error("No metadata found in session.");
            res.status(400).json({ error: "Invalid session metadata" });
            return;
        }

        const {
            senderEmail,
            senderNumber,
            receiverEmail,
            receiverNumber,
            dispatchedDate,
            receiverLat,
            receiverLng,
            senderLat,
            senderLng,
            price,
            deliveryStatus
        } = session.metadata;

        try {
            const result = await db.exec("createParcel", {
                senderEmail,
                receiverNumber,
                senderNumber,
                receiverEmail,
                dispatchedDate,
                price,
                receiverLat,
                receiverLng,
                senderLat,
                senderLng,
                deliveryStatus
            });

            if (!result || result.length === 0) {
                console.error("Parcel creation failed.");
                res.status(500).json({ message: "Failed to create parcel" });
                return;
            }
            // Send SMS
            await fetch("http://localhost:7000/send-sms", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                to: receiverNumber,
                message: "Your parcel is on the way."
                }),
            });
  

            console.log("Parcel successfully saved after payment.");
            res.status(200).json({ message: "Parcel saved successfully after payment." });

        } catch (dbError) {
            console.error("Database Error:", dbError);
            res.status(500).json({ message: "Database execution error", error: dbError });
        }
    } else {
        res.status(400).json({ error: "Unhandled event type" });
    }
};
