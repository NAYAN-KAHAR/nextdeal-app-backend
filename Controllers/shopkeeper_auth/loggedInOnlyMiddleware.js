import jwt from 'jsonwebtoken';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';

import dotenv from 'dotenv';
dotenv.config();


const loggedInOnlyMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.shopkeeperToken;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    // console.log('shop_token', token);

    const decoded = jwt.verify(token, process.env.SHOPKEEPER_SECRET);
    const mobile = decoded.mobile;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const restaurant = await RestaurantOwnerModel.findOne({ mobile: shopkeeper.mobile });

    req.user = decoded;
    req.userType = restaurant ? 'restaurantOwner' : 'shopkeeper';

    next();
  } catch (err) {
    console.error('Login check failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default loggedInOnlyMiddleware;
