
import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';


const freeCouponCountLogic =  async (req, res) => {
  try {

    const mobile =  req.user?.mobile;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const coupons = await FreeCoupon.find({ shopkeeper: shopkeeper._id }).lean();

    let totalCreated = 0;
    coupons.forEach(coupon =>  totalCreated += parseInt(coupon.freeCoupon));

    const MAX_COUPONS = 15;
    const remaining = MAX_COUPONS - totalCreated;
    res.json({ totalCreated, remaining });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export default freeCouponCountLogic;