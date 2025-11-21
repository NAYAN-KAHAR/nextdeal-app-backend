import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import Subscription from '../../Models/subscriptionModel.js';
import NextOffersModel from '../../Models/shopkeeperActivitiesModels/nextOrderModel.js';

const getAllShopkeeperDetails = async (req, res) => {
  try {

    const shopkeeper = await ShopkeeperAuth.find();

    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subs = await Subscription.find();
    if(!subs){
        return res.status(404).json({ error: 'subs not found' });
    };
    const couponGenerated = await NextOffersModel.find();
    return res.status(200).json({ message: 'Get user successfully', shopkeeper, subs, couponGenerated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllShopkeeperDetails;
