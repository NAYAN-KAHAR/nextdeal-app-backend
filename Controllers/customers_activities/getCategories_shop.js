
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import RecurringCouponModel from '../../Models/shopkeeperActivitiesModels/recurringCouponModel.js';

const getCategoriesShop = async (req, res) => {
  try {
    let { category } = req.params; 
    if (!category) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    console.log('category', category);

    const shopkeeper = await ShopkeeperAuth.find({business_category: category });
    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Get user successfully', shopkeeper });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getCategoriesShop;
