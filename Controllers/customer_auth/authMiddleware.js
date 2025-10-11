import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


// a middleware to verify JWT:
const authMiddleware = (req, res, next) => {
  const token = req.cookies.customerToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.CUSTOMER_SECRET}` || 'fallbackSecret');
    req.user = decoded; // Add user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
