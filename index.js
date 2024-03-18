// index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// import authRoute from './routes/auth.js';
 
import errorHandler from './middleware/error.js'; 
import userRouter from './routes/user.js';
import organizationRouter from './routes/organization.js'
import shipmentRouter from './routes/shipment.js'


 
dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const app = express();
app.use(express.json())

// Enable CORS for a specific origin
app.use(cors({ origin: '*' }));

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
});
//basic home route
app.get("/", (req, res) => {
  res.send("home");
});
 
// app.use('/auth', authRoute);
app.use('/user', userRouter)  
app.use('/organizations',organizationRouter)
app.use('/shipment',shipmentRouter)


// checkSubscription.start()
// createSubscriptionOrdersCron.start()
 
app.use(errorHandler);
