
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';

const getShopkeeper = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const mobile = req.user?.mobile;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();

    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Get user successfully', shopkeeper });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getShopkeeper;
