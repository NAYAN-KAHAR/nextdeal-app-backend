
import RecurringCouponModel from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';


const getAllFreeCoupons = async (req, res) => {
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

// Get pagination values
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Apply pagination
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

   res.status(200).json({page,limit,total:filteredCoupons.length, filteredCoupons:paginatedCoupons});
      

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getAllFreeCoupons;


/*
const getAllFreeCoupons = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Get all coupons for this shopkeeper
    const allRecurringCoupons = await RecurringCouponModel.find({ shopkeeper: shopkeeper._id });

    if (!allRecurringCoupons || allRecurringCoupons.length === 0) {
      return res.json({ message: 'No Coupons found', coupons: [] });
    }

    // Filter out already used coupons
    const filteredCoupons = [];
    for (const coupon of allRecurringCoupons) {
      const isUsed = await SaleCouponsModel.exists({ coupon_id: coupon._id });
      if (!isUsed) {
        filteredCoupons.push(coupon);
      }
    }

    // Get pagination values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Apply pagination
    const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

    res.status(200).json({
      page,
      limit,
      total: filteredCoupons.length,
      coupons: paginatedCoupons,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

*/