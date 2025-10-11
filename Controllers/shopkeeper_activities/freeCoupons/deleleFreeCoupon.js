
import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

const DeleteFreeCoupon = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const couponId = req.params.id;
    
    if (!couponId) {
      return res.status(400).json({ error: 'Coupon ID is required' });
    }

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const coupon = await FreeCoupon.findOne({ _id: couponId, shopkeeper: shopkeeper._id });
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found for this shopkeeper' });
    }

    await FreeCoupon.findByIdAndDelete(couponId);
    res.status(200).json({ message: 'Deleted coupon successfully', deletedCoupon: coupon });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default DeleteFreeCoupon;
