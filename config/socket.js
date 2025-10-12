// socket.js
import { Server } from 'socket.io';
import ShopkeeperAuth from '../Models/shopkeeperAuth.js'
import RedeemedCoupon from '../Models/redeemedCouponModel.js';

let io;
const shopkeeperSockets = new Map(); // mobile -> socket.id

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['https://nextdeal-app-shopkeerper-frontend.vercel.app',
        'https://nextdeal-app-customer-frontend-s138.vercel.app'],
      // origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Shopkeeper registers themselves with mobile
    socket.on('register-shopkeeper', async (mobile) => {
      if (!mobile) return;

      // Verify shopkeeper exists in DB
      const exists = await ShopkeeperAuth.findOne({ mobile });
      if (!exists) {
        console.log(`Unverified shopkeeper attempted to register: ${mobile}`);
        return;
      }

      shopkeeperSockets.set(mobile, socket.id);
      console.log(`Shopkeeper ${mobile} registered with socket ${socket.id}`);

      // Get all undelivered coupons for this shopkeeper and emit them
      try {
        const undeliveredCoupons = await RedeemedCoupon.find({ shopkeeper_mobile: mobile, delivered: false });

        for (const coupon of undeliveredCoupons) {
          io.to(socket.id).emit('redeem-coupon', coupon);

          // Mark coupon as delivered
          coupon.delivered = true;
          await coupon.save();
        }
      } catch (err) {
        console.error('Error fetching/sending undelivered coupons:', err);
      }
    });

    // Handle redeem request from customer
    socket.on('redeem-coupon', async (data) => {
      const { shopkeeper_mobile } = data;
      if (!shopkeeper_mobile) {
        console.log('redeem-coupon event missing shopkeeper_mobile');
        return;
      }

      const targetSocketId = shopkeeperSockets.get(shopkeeper_mobile);
      console.log('Received redeem-coupon data:', data);

      if (targetSocketId) {
        io.to(targetSocketId).emit('redeem-coupon', data);
        console.log(`Sent redeem-coupon to shopkeeper ${shopkeeper_mobile}`);
      } else {
        console.log(`No connectedded shopkeeper for mobile: ${shopkeeper_mobile}`);

        // Optionally save to DB to queue for offline shopkeeper
        try {
          const couponDoc = new RedeemedCoupon({ ...data, delivered: false });
          await couponDoc.save();
          console.log('Coupon saved for later delivery');
        } catch (error) {
          console.error('Failed to save coupon for offline shopkeeper:', error);
        }
      }
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Remove from shopkeeperSockets
      for (const [mobile, id] of shopkeeperSockets.entries()) {
        if (id === socket.id) {
          shopkeeperSockets.delete(mobile);
          console.log(`Removed shopkeeper ${mobile} from active sockets`);
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export { createSocketServer, getIO };


// // socket.js
// import { Server } from 'socket.io';
// import ShopkeeperAuth from '../Models/shopkeeperAuth.js';
// import customersAuth from '../Models/customerAuth.js';

// let io;
// const shopkeeperSockets = new Map(); // mobile -> socket.id

// const createSocketServer = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: ['http://localhost:3000', 'http://localhost:3001'],
//       credentials: true,
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Shopkeeper registers themselves with mobile
//     socket.on('register-shopkeeper', async (mobile) => {
//       if (!mobile) return;

//       // Optional: verify shopkeeper exists in DB
//       const exists = await ShopkeeperAuth.findOne({ mobile });
//       if (!exists) {
//         console.log(`Unverified shopkeeper attempted to register: ${mobile}`);
//         return;
//       }

//       shopkeeperSockets.set(mobile, socket.id);
//       console.log(`Shopkeeper ${mobile} registered with socket ${socket.id}`);
//     });

//     // Handle redeem request from customer
//     socket.on('redeem-coupon', (data) => {
//       const { shopkeeper_mobile } = data;
//       const targetSocketId = shopkeeperSockets.get(shopkeeper_mobile);

//       console.log('data', data);

//       if (targetSocketId) {
//         io.to(targetSocketId).emit('redeem-coupon', data);
//         console.log(`Sent redeem-coupon to shopkeeper ${shopkeeper_mobile}`);
//       } else {
//         console.log(`No connected shopkeeper for mobile: ${shopkeeper_mobile}`);
//       }
//     });

//     // Clean up on disconnect
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);

//       // Remove from shopkeeperSockets
//       for (const [mobile, id] of shopkeeperSockets.entries()) {
//         if (id === socket.id) {
//           shopkeeperSockets.delete(mobile);
//           console.log(`Removed shopkeeper ${mobile} from active sockets`);
//           break;
//         }
//       }
//     });
//   });

//   return io;
// };

// const getIO = () => {
//   if (!io) throw new Error("Socket.io not initialized");
//   return io;
// };

// export { createSocketServer, getIO };




// import { Server } from 'socket.io';
// let io;

// const createSocketServer = (server) => {
//     io = new Server(server, {
//         cors: { origin: ['http://localhost:3000', 'http://localhost:3001'],credentials: true } });

//     io.on('connection', (socket) => {
//         console.log('A user connected:', socket.id);
        
//          socket.on('redeem-coupon', (data) => {
//             console.log('Received message:', data);
//             socket.emit('message', `Server received: ${data}`);
//              // Broadcast to all clients (can be improved to target specific shopkeeper)
//             io.emit('redeem-coupon', data);

//         });
        
//         socket.on('disconnect', () => {
//             console.log('User disconnected:', socket.id);
//         });
//     });

//     return io;
// };

// const getIO = () => {
//     if (!io) throw new Error("Socket.io not initialized");
//     return io;
// };

// export { createSocketServer, getIO };
