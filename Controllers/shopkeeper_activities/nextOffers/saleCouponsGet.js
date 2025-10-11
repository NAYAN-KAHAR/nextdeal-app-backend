

import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';

const getAllSalesCoupons = async (req, res) => {
    try {
        const mobile = req.user.mobile;
        const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

        const allCoupons = await SaleCouponsModel.find({ shopkeeper_mobile: shopkeeper.mobile });

         if(!allCoupons){
           return res.json({message:'No Coupons found'});
         }

        res.status(201).json({ message: 'Fetched Coupon successfully', allCoupons});

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getAllSalesCoupons;


