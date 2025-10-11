import jwt from 'jsonwebtoken';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import Subscription from '../../Models/subscriptionModel.js';

import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.shopkeeperToken;

    // Step 1: No token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Step 2: Decode token
    const decoded = jwt.verify(token, process.env.SHOPKEEPER_SECRET);
    const mobile = decoded.mobile;
    if (!mobile) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Step 3: Find shopkeeper
    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: "Shopkeeper not found" });
    }

    // Step 4: Check subscription
    const subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });
    if (!subscription) {
      return res.status(403).json({ error: "No subscription found. Please subscribe first." });
    }

    // Step 5: Check if subscription expired
    const now = new Date();
    if (new Date(subscription.expiresAt) < now) {
      return res.status(405).json({ error: "Subscription expired. Please renew." });
    }

    // ✅ Everything valid
    req.user = decoded;
    req.subscription = subscription;
    next();

  } catch (err) {
    console.error("AuthMiddleware error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
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

