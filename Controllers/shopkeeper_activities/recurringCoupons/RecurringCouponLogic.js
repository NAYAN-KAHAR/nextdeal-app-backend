
import RecurringCouponModel  from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

const recurringCouponLogic = async (req, res) => {
    try {
        const mobile = req.user.mobile;
        const { discountType } = req.body;

        const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

        const saveRecurring = new RecurringCouponModel({shopkeeper: shopkeeper._id, ...req.body,
         discountType: discountType?.toLowerCase()
       });

        const savedCoupon = await saveRecurring.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon: savedCoupon});


  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default recurringCouponLogic;
