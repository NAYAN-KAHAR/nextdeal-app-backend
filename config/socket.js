import { Server } from 'socket.io';
import ShopkeeperAuth from '../Models/shopkeeperAuth.js';
import redeemedCouponModel from '../Models/redeemedCouponModel.js';

let io;
const shopkeeperSockets = new Map(); // mobile -> socket.id

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['https://nextdeal-app-shopkeerper-frontend.vercel.app',
        'https://nextdeal-app-customer-frontend.vercel.app'],
      // origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 🧾 Register shopkeeper by mobile
    socket.on('register-shopkeeper', async (mobile) => {
      if (!mobile) return;

      try {
        const exists = await ShopkeeperAuth.findOne({ mobile });
        if (!exists) {
          console.log(`Unverified shopkeeper tried to register: ${mobile}`);
          return;
        }

        shopkeeperSockets.set(mobile, socket.id);
        console.log(`Shopkeeper ${mobile} registered with socket ${socket.id}`);

        // 🔄 Emit only undelivered coupons
        const undeliveredCoupons = await redeemedCouponModel.find({
          shopkeeper_mobile: mobile,
          delivered: false
        });

        for (const coupon of undeliveredCoupons) {
          try {
            io.to(socket.id).emit('redeem-coupon', coupon);
            console.log(`Sent undelivered coupon to ${mobile}`);

            // Mark as delivered
            coupon.delivered = true;
            await coupon.save();
          } catch (e) {
            console.error(`Error delivering coupon:`, e.message);
          }
        }
      } catch (err) {
        console.error(' Error in register-shopkeeper:', err.message);
      }
    });

    // 💳 Redeem coupon event
    socket.on('redeem-coupon', async (data) => {
      const {
        shopkeeper_mobile,
        customer_mobile,
        coupon_id,
        couponName,
        discount,
        discountType,
        spendingAmount
      } = data;

      if (!shopkeeper_mobile || !customer_mobile || !coupon_id || !couponName || !discount || !discountType || !spendingAmount) {
        console.log('Missing required coupon fields:', data);
        return;
      }

      try {
        // Check if this coupon was already redeemed
        const alreadyExists = await redeemedCouponModel.findOne({
          shopkeeper_mobile,
          customer_mobile,
          coupon_id,
        });

        if (alreadyExists) {
          console.log('Duplicate coupon detected. Skipping save.');
          return;
        }

        // Save new coupon
        const couponDoc = new redeemedCouponModel({
          ...data,
          delivered: false
        });

        await couponDoc.save();
        console.log('Coupon saved to DB');

        const targetSocketId = shopkeeperSockets.get(shopkeeper_mobile);

        if (targetSocketId) {
          io.to(targetSocketId).emit('redeem-coupon', couponDoc);
          console.log(`Coupon sent to online shopkeeper ${shopkeeper_mobile}`);

          couponDoc.delivered = true;
          await couponDoc.save();
        } else {
          console.log(`Shopkeeper ${shopkeeper_mobile} offline. Coupon will be sent later.`);
        }
      } catch (err) {
          console.error('❌ Error redeeming coupon:', err);
      }
    });

    // 🔌 Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);

      for (const [mobile, id] of shopkeeperSockets.entries()) {
        if (id === socket.id) {
          shopkeeperSockets.delete(mobile);
          console.log(`🗑️ Removed shopkeeper ${mobile} from active sockets`);
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
