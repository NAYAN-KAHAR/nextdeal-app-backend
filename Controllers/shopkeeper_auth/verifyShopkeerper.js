import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();


const verifyShopkeeper = (req, res) => {
  const token = req.cookies.shopkeeperToken;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.SHOPKEEPER_SECRET}` || 'fallback');
    // console.log('decode', decoded);
    return res.status(200).json({ authenticated: true, shopkeeper: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
};

export default verifyShopkeeper;
