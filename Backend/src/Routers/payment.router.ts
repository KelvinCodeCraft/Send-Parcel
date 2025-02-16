import { Router } from 'express';
import { createCheckoutSession } from '../payments';

const paymentRouter = Router();

paymentRouter.post('/checkout-session', createCheckoutSession);

export default paymentRouter;