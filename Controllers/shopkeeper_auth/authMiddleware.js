
import jwt from 'jsonwebtoken';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js'
import Subscription from '../../Models/subscriptionModel.js';

import dotenv from 'dotenv';
dotenv.config();



const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.shopkeeperToken;

    // Step 1: Check for token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    // Step 2: Verify token and get mobile number
    const decoded = jwt.verify(token, `${process.env.SHOPKEEPER_SECRET}`);
    const mobile = decoded.mobile;

    // Step 3: Find shopkeeper
    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: "Shopkeeper not found" });
    }

    // Step 4: Check for existing subscription
    const subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });

    // if (!subscription) {
    //   // New shopkeeper, no subscription yet
    //    res.status(403).json({ error: "No subscription found" });
    //    req.user = decoded;
    //    return next();
    // }


    if (!subscription) {
      // Allow it to proceed, but mark that subscription is needed
      req.user = decoded;
      req.subscription = null;
      req.subscriptionNeeded = true;
      return next(); // ✅ Let the route handler decide
  }


    // Step 5: Check if subscription is expired
    const now = new Date();
    if (new Date(subscription.expiresAt) < now) {
      return res.status(405).json({ error: "Subscription expired. Please renew." });
    }

    // Step 6: All good — attach shopkeeper info and continue
    req.user = decoded;
    req.subscription = subscription;

    next();

  } catch (err) {
    console.error("Subscription check failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default authMiddleware;


// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.shopkeeperToken;
//     if (!token) {
//       return res.status(401).json({ error: "Unauthorized: No token" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, 'shopkeeperSecret');
//     const mobile = decoded.mobile;

//     const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
//     if (!shopkeeper) {
//       return res.status(404).json({ error: "Shopkeeper not found" });
//     }

//     const subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });

//     if (!subscription) {
//         res.status(403).json({ error: "No subscription found" });
//     }

//     const now = new Date();
//     // const now = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);
//     if (new Date(subscription.expiresAt) < now) {
//       return res.status(405).json({ error: "Subscription expired. Please renew." });
//     }

//     // Attach user and subscription to req for further use
//     req.user = decoded;
//     req.subscription = subscription;

//     next();

//   } catch (err) {
//     console.error("Subscription check failed:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export default authMiddleware;


// // a middleware to verify JWT:
// const authMiddleware = (req, res, next) => {
//   const token = req.cookies.shopkeeperToken;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'shopkeeperSecret' || 'fallbackSecret');
//     req.user = decoded; // Add user info to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// export default authMiddleware;
