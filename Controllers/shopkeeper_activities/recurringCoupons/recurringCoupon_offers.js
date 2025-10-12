
import RecurringCouponModel from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';


const getAllRecurringCouponsOffers = async (req, res) => {
    try {
        const mobile = req.user.mobile;
        const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

        const allRecurringCoupons = await RecurringCouponModel.find({ shopkeeper: shopkeeper._id });
         if(!allRecurringCoupons){
           return res.json({message:'No Coupons found'});
         }

         if (allRecurringCoupons.length === 0) {
           return res.json({ message: 'No Coupons found' });
        }

        const filteredCoupons = [];

        for (const coupon of allRecurringCoupons) {
          const isUsed = await SaleCouponsModel.exists({ 'coupon_id': coupon._id });
          if (!isUsed) {
            filteredCoupons.push(coupon);
          }
        }

     res.status(200).json({filteredCoupons});
      

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getAllRecurringCouponsOffers;
