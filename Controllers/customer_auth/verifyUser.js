import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const verifyUser = (req, res) => {
  const token = req.cookies.customerToken;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, `${process.env.CUSTOMER_SECRET}` || 'fallback');
    // console.log('decode', decoded);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
};

export default verifyUser;
