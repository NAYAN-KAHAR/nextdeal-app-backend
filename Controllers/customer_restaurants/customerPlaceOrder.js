import mongoose from "mongoose";
import OrderModel from '../../Models/restuarentActivitiesModels/orderPlaceModel.js';
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import FoodSubCategory from '../../Models/restuarentActivitiesModels/foodSubCategoryModel.js';
import RestaurantLocationModel from '../../Models/restuarentActivitiesModels/address_Location.js';
import { getIO, restaurantSockets } from '../../config/socket.js';
import AddOnModel from "../../Models/restuarentActivitiesModels/addOn_Model.js";


const generateUniqueId = () => {
  const numbers = '0123456789';
  let result = '';
  for (let i = 0; i <4; i++) {
    let code = Math.floor(Math.random() * numbers.length);
    result += numbers[code];
  }
  return result;
};



const customerPlaceOrder = async (req, res) => {
  const mobile = req.user?.mobile;
  const { orderData, addressFormat, tips = 0, instructions = [], deliveryType, deliveryFee = 30 } = req.body;

  try {
    if (!mobile) return res.status(400).json({ error: "Customer not authenticated" });
    if (!orderData || orderData.length === 0) return res.status(400).json({ error: "No items to order." });
    if (!addressFormat) return res.status(400).json({ error: "Please provide address." });

    const storedUserID = orderData[0].userId; // assume all items are for same user
    const items = [];

    for (const value of orderData) {
      // If it’s a food item
      if (value.FoodSubCategory) {
        const food = await FoodSubCategory.findById(value.FoodSubCategory).lean();
        if (!food) continue;

        const foodItem = {
          foodItemId: food._id,
          name: food.name,
          price: food.price,
          quantity: value.count,
          image: food.image,
          discount: food.Discount || 0,
          totalItemPrice: (food.price - (food.Discount || 0)) * value.count,
          addOns: [],
          restaurant: food.restaurant.toString(),
        };

        items.push(foodItem);

      } 
      // If it’s an add-on
      else if (value.addOnId) {
        if (items.length === 0) continue; // no food item to attach to

        const addOn = await AddOnModel.findById(value.addOnId).lean();
        if (!addOn) continue;

        const addOnItem = {
          addOnItem: addOn._id,
          name: addOn.name,
          price: addOn.price,
          quantity: value.count,
          image: addOn.image,
          discount: 0,
          totalItemPrice: addOn.price * value.count,
        };

        // Attach to last food item
        const lastFoodItem = items[items.length - 1];
        lastFoodItem.addOns.push(addOnItem);
        lastFoodItem.totalItemPrice += addOnItem.totalItemPrice; // update total
      }
    }

    const validItems = items.filter(Boolean);
    if (validItems.length === 0) return res.status(400).json({ error: "Invalid order items." });

    const restaurantIdStr = validItems[0].restaurant;

    // Calculate totals
    const subTotal = validItems.reduce((sum, i) => sum + i.totalItemPrice, 0);
    const total = subTotal + deliveryFee + tips;

    const newOrder = {
      customerId: storedUserID,
      restaurantId: restaurantIdStr,
      items: validItems,
      deliveryAddress: { 
        ...addressFormat, 
        coordinates: { lat: addressFormat.latitude, lng: addressFormat.longitude } 
      },
      paymentInfo: { method: "COD", status: "Pending", amountPaid: total },
      pricing: { subTotal, deliveryFee, discount: 0, total },
      deliveryStatus: "Order Placed",
      orderCode: generateUniqueId(),
      deliveryType,
      tip: tips,
      instructions
    };

    const insertedOrders = await OrderModel.insertMany([newOrder]);

    // Clear temporary food items
    await FoodItemsModel.deleteMany({ userId: storedUserID });

    // Notify restaurant via socket
    const io = getIO();
    const restaurantSocketIds = restaurantSockets.get(restaurantIdStr);
    if (restaurantSocketIds && restaurantSocketIds.size > 0) {
      restaurantSocketIds.forEach(socketId => {
        io.to(socketId).emit("new-order", {
          message: "New order received",
          orderId: insertedOrders[0]._id,
          items: validItems,
          total,
          customerMobile: mobile
        });
      });
    }

    return res.status(201).json({ message: "Order placed successfully!", insertedOrders });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

export default customerPlaceOrder;



// const customerPlaceOrder = async (req, res) => {
//   const mobile = req.user?.mobile;
//   const { orderData, addressFormat, tips, instructions, deliveryType } = req.body;
//   console.log('place order', req.body);

//   try {
//     if (!mobile) return res.status(400).json({ error: "Customer not authenticated" });
//     if (!orderData || orderData.length === 0) return res.status(400).json({ error: "No items to order." });
//     if (!addressFormat) return res.status(400).json({ error: "Please provide address." });

//     let storedUserID;

//     // // Prepare order items
//     // const items = await Promise.all(orderData.map(async (value) => {
//     //   const { FoodSubCategory: foodSubCategoryId, count, userId } = value;
//     //   storedUserID = userId;

//     //   const foodDetails = await FoodSubCategory.findById(foodSubCategoryId).lean();
//     //   if (!foodDetails) return null;

//     //   const totalItemPrice = (foodDetails.price - foodDetails.Discount) * count;

//     //   return {
//     //     foodItemId: foodDetails._id,
//     //     name: foodDetails.name,
//     //     price: foodDetails.price,
//     //     quantity: count,
//     //     image: foodDetails.image,
//     //     discount: foodDetails.Discount,
//     //     totalItemPrice,
//     //     restaurant: foodDetails.restaurant.toString() // make string for socket map
//     //   };
//     // }));

//      // Build addOns array
//     const addOnMap = {};
//     for (const value of orderData) {
//       if (value.FoodSubCategory) {
//         const food = await FoodSubCategory.findById(value.FoodSubCategory).lean();

//         const foodItem = {
//           foodItemId: food._id,
//           name: food.name,
//           price: food.price,
//           quantity: value.count,
//           image: food.image,
//           discount: food.Discount || 0,
//           totalItemPrice: (food.price - (food.Discount || 0)) * value.count,
//           addOns: [],  // Attach here
//         };

//         // If this line has an addon attached
//         if (addOnMap[value._id]) {
//           foodItem.addOns.push(addOnMap[value._id]);
//         }

//         items.push(foodItem);
//       }
//     }

//     const items = [];

//     for (const value of orderData) {
//       if (value.FoodSubCategory) {
//         const food = await FoodSubCategory.findById(value.FoodSubCategory).lean();

//         const foodItem = {
//           foodItemId: food._id,
//           name: food.name,
//           price: food.price,
//           quantity: value.count,
//           image: food.image,
//           discount: food.Discount || 0,
//           totalItemPrice: (food.price - (food.Discount || 0)) * value.count,
//           addOns: [],  // Attach here
//         };

//         // If this line has an addon attached
//         if (addOnMap[value._id]) {
//           foodItem.addOns.push(addOnMap[value._id]);
//         }

//         items.push(foodItem);
//       }
//     }


//     const validItems = items.filter(Boolean);
//     if (validItems.length === 0) return res.status(400).json({ error: "Invalid order items." });

//     const restaurantIdStr = validItems[0].restaurant;

//     // Check restaurant distance
//     // const restaurantDistance = await RestaurantLocationModel.aggregate([
//     //   {
//     //     $geoNear: {
//     //       near: {
//     //         type: "Point",
//     //         coordinates: [
//     //           parseFloat(addressFormat.longitude),
//     //           parseFloat(addressFormat.latitude)
//     //         ]
//     //       },
//     //       distanceField: "distance",
//     //       spherical: true,
//     //       query: { restaurants_Owner: new mongoose.Types.ObjectId(restaurantIdStr) }
//     //     }
//     //   },
//     //   { $limit: 1 }
//     // ]);

//     //   if (!restaurantDistance.length) return res.status(404).json({ error: "Restaurant location not found." });

//     //   const distanceKm = restaurantDistance[0].distance / 1000;
//     //   if (distanceKm > 16) return res.status(400).json({ error: "Restaurant is too far.", distance: distanceKm });

//       // Calculate totals
//       const subTotal = validItems.reduce((sum, i) => sum + i.totalItemPrice, 0);
//       const deliveryFee = 30;
//       const total = subTotal + deliveryFee + tips;


//      const newOrder = {
//       customerId: storedUserID,
//       restaurantId: restaurantIdStr,
//       items: validItems,       // addOns already inside items
//       deliveryAddress: { 
//         ...addressFormat, 
//         coordinates: { lat: addressFormat.latitude, lng: addressFormat.longitude } 
//       },
//       paymentInfo: { method: "COD", status: "Pending", amountPaid: total },
//       pricing: { subTotal, deliveryFee, discount: 0, total },
//       deliveryStatus: "Order Placed",
//       orderCode: generateUniqueId(),
//       deliveryType: deliveryType,
//       tip: tips,
//       instructions: instructions
//     };

//     const insertedOrders = await OrderModel.insertMany([newOrder]);
//     await FoodItemsModel.deleteMany({ userId: storedUserID });


//     // When order is placed using socket emit notifiction
//       const io = getIO();
//       const restaurantSocketIds = restaurantSockets.get(restaurantIdStr);

//       if (restaurantSocketIds && restaurantSocketIds.size > 0) {
//         restaurantSocketIds.forEach(socketId => {
//           io.to(socketId).emit("new-order", {
//             message: "New order received",
//             orderId: insertedOrders[0]._id,
//             items: validItems,
//             total,
//             customerMobile: mobile
//           });
//         });
//         console.log(`✅ Order sent to restaurant ${restaurantIdStr}`);
//       } else {
//         console.warn(`⚠️ Restaurant ${restaurantIdStr} is offline.`);
//       }

//     return res.status(201).json({ message: "Order placed successfully!", distance: distanceKm, insertedOrders });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Something went wrong." });
//   }
// };

// export default customerPlaceOrder;


/*
import mongoose from "mongoose";
import { getIO } from "../socket.js";
import OrderModel from "../models/OrderModel.js";
import FoodSubCategory from "../models/FoodSubCategory.js";
import RestaurantLocationModel from "../models/RestaurantLocationModel.js";
// import redis from "../config/redis.js";  // optional, recommended

// Much faster than randomness inside loop
const generateCode = () => String(Math.floor(1000 + Math.random() * 9000));


// Fast Haversine formula (VERY fast, no DB needed)
const calcDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * 0.01745329252;
  const dLon = (lon2 - lon1) * 0.01745329252;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * 0.01745329252) *
      Math.cos(lat2 * 0.01745329252) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};



export const customerPlaceOrder = async (req, res) => {
  try {
    const mobile = req.user?.mobile;
    const { orderData, addressFormat, tips = 0, instructions, deliveryType } = req.body;

    if (!mobile) return res.status(400).json({ error: "Customer not authenticated" });
    if (!orderData?.length) return res.status(400).json({ error: "No items to order." });
    if (!addressFormat) return res.status(400).json({ error: "Address missing." });

    // =====================================================
    // 1) BATCH FETCH ALL FOOD ITEMS IN ONE QUERY
    // =====================================================
    const itemIds = orderData.map(o => o.FoodSubCategory);
    const foodItems = await FoodSubCategory.find({ _id: { $in: itemIds } }).lean();

    const foodMap = new Map(foodItems.map(f => [String(f._id), f]));

    let storedUserID = null;
    const validItems = [];

    for (const o of orderData) {
      const food = foodMap.get(String(o.FoodSubCategory));
      if (!food) continue;

      storedUserID = o.userId;

      const totalItemPrice = (food.price - food.Discount) * o.count;

      validItems.push({
        foodItemId: food._id,
        name: food.name,
        price: food.price,
        quantity: o.count,
        image: food.image,
        discount: food.Discount,
        totalItemPrice,
        restaurant: food.restaurant.toString(),
      });
    }

    if (!validItems.length) {
      return res.status(400).json({ error: "Invalid item data." });
    }

    const restaurantId = validItems[0].restaurant;

    // =====================================================
    // 2) GET RESTAURANT LOCATION FROM CACHE or DB
    // =====================================================

    let restaurantLocation;

    // try Redis cache first (commented out for optional use)
    // const cachedLoc = await redis.get(`restLoc:${restaurantId}`);
    // if (cachedLoc) {
    //   restaurantLocation = JSON.parse(cachedLoc);
    // } else {
    restaurantLocation = await RestaurantLocationModel.findOne({
      restaurants_Owner: restaurantId,
    }).lean();

    if (!restaurantLocation) {
      return res.status(404).json({ error: "Restaurant location not found." });
    }

    //   await redis.set(`restLoc:${restaurantId}`, JSON.stringify(restaurantLocation), "EX", 3600);
    // }

    // =====================================================
    // 3) COMPUTE DISTANCE FAST (NO $geoNear)
    // =====================================================
    const distanceKm = calcDistanceKm(
      parseFloat(addressFormat.latitude),
      parseFloat(addressFormat.longitude),
      restaurantLocation.location.coordinates[1],
      restaurantLocation.location.coordinates[0]
    );

    if (distanceKm > 16) {
      return res.status(400).json({ error: "Restaurant is too far.", distance: distanceKm });
    }

    // =====================================================
    // 4) COMPUTE TOTALS
    // =====================================================
    const subTotal = validItems.reduce((sum, i) => sum + i.totalItemPrice, 0);
    const deliveryFee = 30;
    const total = subTotal + deliveryFee + tips;

    const orderDoc = {
      customerId: storedUserID,
      restaurantId,
      items: validItems,
      deliveryAddress: {
        ...addressFormat,
        coordinates: { lat: addressFormat.latitude, lng: addressFormat.longitude },
      },
      paymentInfo: { method: "COD", status: "Pending", amountPaid: total },
      pricing: { subTotal, deliveryFee, discount: 0, total },
      deliveryStatus: "Order Placed",
      orderCode: generateCode(),
      deliveryType,
      tip: tips,
      instructions,
    };

    // =====================================================
    // 5) INSERT ORDER → SUPER FAST
    // =====================================================
    const insertedOrder = await OrderModel.create(orderDoc);

    // Remove cart items async (non-blocking)
    FoodItemsModel.deleteMany({ userId: storedUserID }).catch(() => {});


    // =====================================================
    // 6) PUSH SOCKET EMIT INTO QUEUE (NON-BLOCKING)
    // =====================================================

    setImmediate(() => {
      const io = getIO();
      const restaurantSocketIds = restaurantSockets.get(restaurantId);

      if (restaurantSocketIds?.size) {
        for (const socketId of restaurantSocketIds) {
          io.to(socketId).emit("new-order", {
            message: "New order received",
            orderId: insertedOrder._id,
            items: validItems,
            total,
            customerMobile: mobile,
          });
        }
      }
    });


    return res.status(201).json({
      message: "Order placed successfully!",
      distance: distanceKm,
      order: insertedOrder,
    });

  } catch (err) {
    console.error("Order Error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

*/