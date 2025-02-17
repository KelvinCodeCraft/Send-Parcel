// import { Router } from 'express';
// import { createCheckoutSession } from '../payments';

// const paymentRouter = Router();

// paymentRouter.post('/checkout-session', createCheckoutSession);

// export default paymentRouter;

import express from "express";
import { createCheckoutSession } from "../Controllers/payment.controller";
import { stripeWebhook } from "../Controllers/webhook.controller";

const paymentRouter = express.Router();

paymentRouter.post("/payment/checkout", createCheckoutSession);
// paymentRouter.post("/payment/checkout/create-checkout-session", createCheckoutSession);

paymentRouter.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default paymentRouter;
