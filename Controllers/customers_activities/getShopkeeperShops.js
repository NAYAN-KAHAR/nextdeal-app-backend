
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';

const getShopkeeperShops = async (req, res) => {
  try {

    const shopkeeper = await ShopkeeperAuth.find();

    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ message: 'Get user successfully', shopkeeper });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getShopkeeperShops;
