 // const trialPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days
import jwt from 'jsonwebtoken';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import Subscription from '../../Models/subscriptionModel.js';
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';

import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.shopkeeperToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SHOPKEEPER_SECRET);
    const mobile = decoded.mobile;
    if (!mobile) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: "Shopkeeper not found" });
    }

    // for restaurant owners
    const isRestaurant = await RestaurantOwnerModel.findOne({ mobile });
    if (isRestaurant) {
      req.isRestaurant = isRestaurant;
      return next();
    }

    // Check subscription
    const subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });
    if (!subscription) {
      return res.status(403).json({ error: "No subscription found. Please subscribe first." });
    }

    // Check if subscription expired
    const now = new Date();
    if (new Date(subscription.expiresAt) < now) {
       return res.status(405).json({ error: "Subscription expired. Please renew." });
    }

    // ✅ Everything valid
    req.user = decoded;
    req.shopkeeper = shopkeeper;
    req.subscription = subscription;
    next();

  } catch (err) {
    console.error("AuthMiddleware error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware;
