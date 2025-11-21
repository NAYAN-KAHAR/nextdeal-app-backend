import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import customersAuth from '../../Models/customerAuth.js';

import NextOffersModel from '../../Models/shopkeeperActivitiesModels/nextOrderModel.js';
import redeemedCouponModel from  '../../Models/redeemedCouponModel.js';
import Subscription from '../../Models/subscriptionModel.js';

// import SaleCouponsModel from '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js'


const getAllDashboardDetails = async (req, res) => {
  try {
    const shopkeepers = await ShopkeeperAuth.find();
    if (!shopkeepers) {
      return res.status(404).json({ error: 'shopkeeper not found' });
    }
    const customers = await customersAuth.find();
     if (!customers) {
      return res.status(404).json({ error: 'shopkeeper not found' });
    }

    const freeCoupon = await FreeCoupon.find();
    const couponGenerated =  await NextOffersModel.find();
    const redeem = await redeemedCouponModel.find();
    const subs = await Subscription.find();

    return res.status(200).json({message: 'Get user successfully',
        customers,shopkeepers, freeCoupon,couponGenerated, redeem, subs
        });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllDashboardDetails;