import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import sendWelcomeEmail from '../background/Email/mail.service';
import router from './Routers/user.router';
import routerp from './Routers/parcel.router';
import paymentRouter from './Routers/payment.router';
import cron from 'node-cron';
import cors from 'cors';
import { stripeWebhook } from "../src/Controllers/webhook.controller";


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 4000;
const app: Express = express();
app.post("/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "*", // Allow only your frontend
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

app.use('/api/users', router);
app.use('/parcel', routerp);
app.use('/', paymentRouter); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello!');
});

cron.schedule('*/1 * * * * *', async () => {
    console.log('running a task every 10 Second');
    await sendWelcomeEmail();
});