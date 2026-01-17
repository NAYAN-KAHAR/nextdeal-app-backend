
import { Server } from 'socket.io';
import ShopkeeperAuth from '../Models/shopkeeperAuth.js';
import redeemedCouponModel from '../Models/redeemedCouponModel.js';
import OrderModel from '../Models/restuarentActivitiesModels/orderPlaceModel.js';

let io;

const shopkeeperSockets = new Map(); // mobile -> socket.id
const restaurantSockets = new Map();  // restaurantId -> Set of socketIds

const createSocketServer = (server) => {
  io = new Server(server, {
    cors: {
       origin: ["http://localhost:3000", "http://localhost:3001"],
      // origin:  ['https://nextdeal-app-shopkeerper-frontend.vercel.app',
      // 'https://nextdeal-app-customer-frontend.vercel.app'],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // --- Shopkeeper registration ---
    socket.on("register-shopkeeper", async (mobile) => {
      if (!mobile) return;
      try {
        const exists = await ShopkeeperAuth.findOne({ mobile });
        if (!exists) return console.log(`Unverified shopkeeper: ${mobile}`);
        shopkeeperSockets.set(mobile, socket.id);
        console.log(`Shopkeeper ${mobile} registered with socket ${socket.id}`);

        // Send undelivered coupons
        const undelivered = await redeemedCouponModel.find({ shopkeeper_mobile: mobile, delivered: false });
        for (const coupon of undelivered) {
          io.to(socket.id).emit("redeem-coupon", coupon);
          coupon.delivered = true;
          await coupon.save();
        }
      } catch (err) {
        console.error(err.message);
      }
    });

    // --- Redeem coupon ---
    socket.on("redeem-coupon", async (data) => {
      try {
        const exists = await redeemedCouponModel.findOne({
          shopkeeper_mobile: data.shopkeeper_mobile,
          customer_mobile: data.customer_mobile,
          coupon_id: data.coupon_id,
        });
        if (exists) return;

        const couponDoc = new redeemedCouponModel({ ...data, delivered: false });
        await couponDoc.save();

        const targetSocketId = shopkeeperSockets.get(data.shopkeeper_mobile);
        if (targetSocketId) {
          io.to(targetSocketId).emit("redeem-coupon", couponDoc);
          couponDoc.delivered = true;
          await couponDoc.save();
        }
      } catch (err) {
        console.error(err);
      }
    });

    // --- Restaurant registration ---
    socket.on("register-restaurant", (restaurantId) => {
      if (!restaurantId) return;
      const id = restaurantId.toString();
      if (!restaurantSockets.has(id)) restaurantSockets.set(id, new Set());
      restaurantSockets.get(id).add(socket.id);

      console.log(`Restaurant ${id} registered with socket ${socket.id}`);
    });

    // --- Disconnect ---
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove shopkeeper socket
      for (const [mobile, id] of shopkeeperSockets.entries()) {
        if (id === socket.id) {
          shopkeeperSockets.delete(mobile);
          break;
        }
      }

      // Remove restaurant socket
      for (const [restId, set] of restaurantSockets.entries()) {
        if (set.has(socket.id)) {
          set.delete(socket.id);
          if (set.size === 0) restaurantSockets.delete(restId);
        }
      }
    });
  });

  return io;
};

// --- Emit a new order only when customer places it ---
const emitNewOrder = (order) => {
  const restaurantSocketIds = restaurantSockets.get(order.restaurantId);
  if (restaurantSocketIds && restaurantSocketIds.size > 0) {
    for (const socketId of restaurantSocketIds) {
      io.to(socketId).emit("new-order", {
        message: "New order received",
        orderId: order._id,
        items: order.items,
        total: order.pricing.total,
        customerMobile: order.customerId,
      });
    }
    console.log(`Order sent to restaurant ${order.restaurantId}`);
  } else {
    console.warn(`Restaurant ${order.restaurantId} is offline. Order will be processed when restaurant connects.`);
  }
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export { createSocketServer, getIO, restaurantSockets, emitNewOrder };




// const shopkeeperSockets = new Map(); // mobile -> socket.id
// const restaurantSockets = new Map();   // <-- ADD THIS

// const createSocketServer = (server) => {
//   io = new Server(server, {
//     cors: {
//       // origin: ['https://nextdeal-app-shopkeerper-frontend.vercel.app',
//       //   'https://nextdeal-app-customer-frontend.vercel.app'],
//       origin: ['http://localhost:3000', 'http://localhost:3001'],
//       credentials: true,
//     },
//   });

//    io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // --- Shopkeeper ---
//     socket.on('register-shopkeeper', async (mobile) => {
//       if (!mobile) return;

//       try {
//         const exists = await ShopkeeperAuth.findOne({ mobile });
//         if (!exists) return console.log(`Unverified shopkeeper: ${mobile}`);

//         shopkeeperSockets.set(mobile, socket.id);
//         console.log(`Shopkeeper ${mobile} registered with socket ${socket.id}`);

//         // Send undelivered coupons
//         const undelivered = await redeemedCouponModel.find({ shopkeeper_mobile: mobile, delivered: false });
//         for (const coupon of undelivered) {
//           io.to(socket.id).emit('redeem-coupon', coupon);
//           coupon.delivered = true;
//           await coupon.save();
//         }
//       } catch (err) {
//         console.error(err.message);
//       }
//     });

//     // --- Redeem coupon ---
//     socket.on('redeem-coupon', async (data) => {
//       try {
//         const exists = await redeemedCouponModel.findOne({
//           shopkeeper_mobile: data.shopkeeper_mobile,
//           customer_mobile: data.customer_mobile,
//           coupon_id: data.coupon_id
//         });
//         if (exists) return;

//         const couponDoc = new redeemedCouponModel({ ...data, delivered: false });
//         await couponDoc.save();

//         const targetSocketId = shopkeeperSockets.get(data.shopkeeper_mobile);
//         if (targetSocketId) {
//           io.to(targetSocketId).emit('redeem-coupon', couponDoc);
//           couponDoc.delivered = true;
//           await couponDoc.save();
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     });

//     // --- Restaurant ---
//     socket.on('register-restaurant', (restaurantId) => {
//       if (!restaurantId) return;
//       const id = restaurantId.toString(); // ensure string
//       if (!restaurantSockets.has(id)) restaurantSockets.set(id, new Set());
//       restaurantSockets.get(id).add(socket.id);
//       console.log(`Restaurant ${id} registered with socket ${socket.id}`);
//       console.log('Current restaurantSockets Map:', Array.from(restaurantSockets.entries()).map(([k,v]) => [k, [...v]]));
//     });

//     socket.on('disconnect', () => {
//       console.log('🔴 User disconnected:', socket.id);

//       // Remove shopkeeper
//       for (const [mobile, id] of shopkeeperSockets.entries()) {
//         if (id === socket.id) {
//           shopkeeperSockets.delete(mobile);
//           break;
//         }
//       }

//       // Remove restaurant sockets
//       for (const [restId, set] of restaurantSockets.entries()) {
//         if (set.has(socket.id)) {
//           set.delete(socket.id);
//           if (set.size === 0) restaurantSockets.delete(restId);
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

// export { createSocketServer, getIO, restaurantSockets };




