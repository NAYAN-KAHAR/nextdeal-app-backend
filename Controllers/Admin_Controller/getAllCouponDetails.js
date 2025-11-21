import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import RecurringCouponModel from  '../../Models/shopkeeperActivitiesModels/recurringCouponModel.js';

const getAllCouponDetails = async (req, res) => {
  try {

    const shopkeeper = await ShopkeeperAuth.find();
    if (!shopkeeper) {
      return res.status(404).json({ error: 'shopkeeper not found' });
    }

    const freeCoupon = await FreeCoupon.find();
    const recurringCoupo =  await RecurringCouponModel.find();
  

    return res.status(200).json({
         message: 'Get user successfully',
         shopkeeper, freeCoupon,recurringCoupo
        });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllCouponDetails;