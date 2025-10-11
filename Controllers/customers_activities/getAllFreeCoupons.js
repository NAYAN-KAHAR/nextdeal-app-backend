import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import SaleCouponsModel from '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';
import customersAuth from '../../Models/customerAuth.js';

const getAllFreeCoupons = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    // console.log('Customer Mobile:', mobile);
    // console.log('mobile', mobile);
    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }


    const allFreeCoupons = await FreeCoupon.find().populate('shopkeeper');
    if (!allFreeCoupons.length) {
      return res.status(404).json({ error: 'No free coupons found' });
    }

  
    const unusedCoupons = [];

    for (const coupon of allFreeCoupons) {
      const isUsed = await SaleCouponsModel.exists({coupon_id: coupon._id});

      if (!isUsed) {
        unusedCoupons.push(coupon);
      }
    }


  return res.status(200).json({ message: 'Unused free coupons fetched successfully',
     allFreeCoupons: unusedCoupons});

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllFreeCoupons;
