
import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

const UpdateFreeCoupon = async (req, res) => {
    try {
        const mobile = req.user.mobile;
          const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

        const isCoupons = await FreeCoupon.find({ shopkeeper: shopkeeper._id });

        let totalCoupons = 0;
        allCoupons.forEach(coupon => {
          totalCoupons += parseInt(coupon.freeCoupon);
        });
        const MAX_COUPONS = 15;
        const newCoupons = parseInt(req.body.freeCoupon);

        if (totalCoupons + newCoupons > MAX_COUPONS) {
        return res.status(403).json({
            error: `You can create only 
            ${MAX_COUPONS - totalCoupons} more coupons.`,
            remaining: MAX_COUPONS - totalCoupons,
        });
        }

        res.status(201).json({ message: 'Coupon created successfully', coupon: savedCoupon});


  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default UpdateFreeCoupon;

