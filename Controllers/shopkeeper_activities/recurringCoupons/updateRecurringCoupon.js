
import RecurringCouponModel from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

const UpdateRecurringCoupon = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const couponId = req.params.id;
  
    if (!couponId) {
      return res.status(400).json({ error: 'Coupon ID is required' });
    }

    if (!req.body) {
      return res.status(400).json({ error: 'Content body is required' });
    }

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const editCuopon = await RecurringCouponModel.findByIdAndUpdate(
      { _id: couponId, shopkeeper: shopkeeper._id }, req.body, {new: true, runValidators:true});

    res.status(200).json({ message: 'Updated coupon successfully', editCuopon });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default UpdateRecurringCoupon;