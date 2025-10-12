import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from './config/db.js';
import http from 'http';

import customerAuthRoute from './Routes/customerAuthRoute.js';
import shopkeeperAuthRoute from './Routes/shopkeerAuthRoute.js';
import shopkeeperActivitiesRoute from './Routes/shopkeeperActivitiesRoute.js';
import customers_activities from './Routes/customersActivitiesRoute.js';

import { createSocketServer } from './config/socket.js'; 

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
createSocketServer(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(cors({
   origin:
    ['https://nextdeal-app-shopkeerper-frontend.vercel.app',
      'https://nextdeal-app-customer-frontend.vercel.app'],

  //  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));



const apiLimit = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 120,
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
app.use('/api', shopkeeperAuthRoute);
app.use('/api', shopkeeperActivitiesRoute);
app.use('/api', customers_activities);



// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



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
