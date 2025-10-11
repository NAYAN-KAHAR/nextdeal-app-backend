import Subscription from '../../Models/subscriptionModel.js';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';


const getShopkeeperSubs = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const mobile = req.user?.mobile;
    const isShopkeeper = await ShopkeeperAuth.findOne({ mobile })
    const shopkeeper = await Subscription.findOne({shopkeeper:isShopkeeper._id });

    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { plan, remainingCoupons} = shopkeeper;

    return res.status(200).json({ message: 'Get user successfully', plan, remainingCoupons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getShopkeeperSubs;
