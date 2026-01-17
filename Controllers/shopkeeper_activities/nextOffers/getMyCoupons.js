
import RecurringCouponModel  from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import customersAuth from '../../../Models/customerAuth.js';
import NextOffersModel from '../../../Models/shopkeeperActivitiesModels/nextOrderModel.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';


const getMyCoupons = async (req, res) => {
    try {
        const mobile = req.user.mobile;
        console.log('mobile', mobile);
        const hasCustomer = await customersAuth.findOne({ mobile }).lean();
        if (!hasCustomer) {
          return res.status(404).json({ error: 'Customer not found' });
        };
        
        const myCoupons = await NextOffersModel.find({customer_mobile:mobile})
        .populate('coupon')
        .populate('shopkeeper');

        console.log(hasCustomer);
        const filteredCoupons = [];

        for (const offer of myCoupons) {
            const isUsed = await SaleCouponsModel.exists({
                coupon_id: offer.coupon?._id,
                shopkeeper_mobile: offer.shopkeeper?.mobile,
                customer_mobile: offer.customer_mobile,
            });

            if (!isUsed) {
                filteredCoupons.push(offer);
            }
        }

        return res.status(201).json({ message: 'Fetch AllCoupons successfully',filteredCoupons,});

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getMyCoupons;
