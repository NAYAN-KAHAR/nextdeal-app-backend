import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from './config/db.js';
import http from 'http';
import compression from 'compression';

import customerAuthRoute from './Routes/customerAuthRoute.js';
import shopkeeperAuthRoute from './Routes/shopkeerAuthRoute.js';
import shopkeeperActivitiesRoute from './Routes/shopkeeperActivitiesRoute.js';
import customers_activities from './Routes/customersActivitiesRoute.js';
import restuarents_activities from './Routes/restuarentRoutes.js';
import customer_restaurentsRoutes from './Routes/customer_restaurentsRoutes.js';

import adminRoutes from './Routes/adminRoutes.js';
import redisClient from './config/redis.js';

// import customersAuth from './Models/customerAuth.js';

import { createSocketServer } from './config/socket.js'; 


const app = express();
const server = http.createServer(app);


// Initialize Socket.IO
createSocketServer(server);

// Middleware
app.use(express.json({ limit:'20kb'}));
app.use(cookieParser());
app.use(helmet());

// Compress response (makes server 2x faster)
// compression() is a middleware that shrinks the response size before sending it to the user.

app.use(compression());

app.use(cors({
    origin:['https://nextdeal-app-shopkeerper-frontend.vercel.app',
        'https://nextdeal-app-customer-frontend.vercel.app'],
      
    // origin: ['http://localhost:3000', 'http://localhost:3001','http://10.155.70.224:3001'],
  credentials: true
}));



const apiLimit = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 150,
  message: "Too many requests, please try again later."
});
app.use(apiLimit);




mongoose.connection.on('error', (err) => {
  console.log('Database connection failed', err);
});

mongoose.connection.on('open', () => {
  console.log('Database connected');
});


// Routes
app.use('/api', customerAuthRoute);
app.use('/api', customers_activities);

app.use('/api',shopkeeperAuthRoute);
app.use('/api',shopkeeperActivitiesRoute);

app.use('/api', adminRoutes);
app.use('/api', restuarents_activities);
app.use('/api', customer_restaurentsRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// ******************************************************************

// const customerLimit = rateLimit({ windowMs: 2*60*1000, max: 200, message: "Too many requests for customer." });
// const shopkeeperLimit = rateLimit({ windowMs: 2*60*1000, max: 300, message: "Too many requests for shopkeeper." });
// const adminLimit = rateLimit({ windowMs: 2*60*1000, max: 500, message: "Too many requests for admin." });
// const restuarentLimit = rateLimit({ windowMs: 2*60*1000, max: 300, message: "Too many requests for restuarent." });


// // Routes
// app.use('/api',customerLimit, customerAuthRoute);
// app.use('/api',customerLimit, customers_activities);

// app.use('/api', shopkeeperLimit,shopkeeperAuthRoute);
// app.use('/api', shopkeeperLimit,shopkeeperActivitiesRoute);

// app.use('/api',adminLimit, adminRoutes);
// app.use('/api',restuarentLimit, restuarents_activities);

// // app.js
// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// app.use(express.json());

// const MSG91_AUTHKEY = process.env.MSG91_AUTHKEY || '474839AoGDg4DjIjSU68fc5cc4P1';

// const sendOTP = async (mobile) => {
//   try {
//     const testMobile = "9999999999"; // MSG91 test number
//     const response = await axios.get("https://control.msg91.com/api/sendotp.php", {
//       params: {
//         authkey:'474839AJ4udKLmg68fc6987P1',
//         mobile: testMobile,
//         otp_length: 4,
//         message: "Your OTP is ##OTP##",
//         sender: "MSGIND",
//         otp: "",
//         country: 91,
//         route: 4
//       }
//     });
//     console.log(response.data)
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     throw err;
//   }
// };

// sendOTP();

// // ----------------- VERIFY OTP -----------------
// app.post('/verify-otp', async (req, res) => {
//   try {
//     const { mobile, otp, otpHash } = req.body;
//     if (!mobile || !otp || !otpHash) {
//       return res.status(400).json({ error: "Mobile, OTP, and OTP hash are required" });
//     }

//     const response = await axios.get("https://control.msg91.com/api/verifyRequestOTP.php", {
//       params: {
//         authkey: MSG91_AUTHKEY,
//         mobile,
//         otp,
//         otp_reference: otpHash
//       },
//     });

//     return res.json(response.data); // { type: 'success' } if OTP is correct
//   } catch (error) {
//     console.error("Error verifying OTP:", error.response?.data || error.message);
//     return res.status(500).json({ error: "Failed to verify OTP" });
//   }
// });

// // ----------------- START SERVER -----------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// *******************************************************************************************


// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet'
// import customerAuthRoute from './Routes/customerAuthRoute.js';
// import shopkeeperAuthRoute from './Routes/shopkeerAuthRoute.js';
// import shopkeeperActivitiesRoute from './Routes/shopkeeperActivitiesRoute.js'
// import customers_activities from './Routes/customersActivitiesRoute.js';

// import cookieParser from 'cookie-parser';
// import mongoose from './config/db.js';
// import rateLimit from 'express-rate-limit';

// import http from 'http'; 
// import { Server as SocketIOServer } from 'socket.io'; 



// const app = express();

// const server = http.createServer(app); // <-- Use this instead of app.listen

// // Setup Socket.IO
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: ['http://localhost:3000',  'http://localhost:3001'],
//     credentials: true,
//   }
// });

// // Handle socket connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Example event
//   socket.on('redeem-coupon', (data) => {
//     console.log('Received message:',  data);
//     // Echo back the message
//     socket.emit('message', `Server received: ${data}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });


// // middleware here
// app.use(express.json());
// app.use(cookieParser()); 
// app.use(helmet())
// const PORT = process.env.PORT || 5000;

// // Limit: 100 requests per 5 minutes per IP
// const apiLimit = rateLimit({
//   windowMs: 5 * 60 * 1000, 
//   max:120,
//   message:"Too many requests, please try again later."
// });
// app.use(apiLimit);

// app.use(cors({
//   origin: ['http://localhost:3000','http://localhost:3001'],
//   credentials: true
// }));



// mongoose.connection.on('error', (err) => {
//     console.log('Database conncetion failed', err)
// })

// mongoose.connection.on('open', () => {
//     console.log('Database connected')
// })


// app.use('/api', customerAuthRoute);
// app.use('/api', shopkeeperAuthRoute);
// app.use('/api', shopkeeperActivitiesRoute);
// app.use('/api', customers_activities);

// // app.listen(PORT, () => { console.log('server running on 5000 PORT') })
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
