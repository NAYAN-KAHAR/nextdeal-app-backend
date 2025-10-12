
import redeemedCouponModel from "../../../Models/redeemedCouponModel.js";
import ShopkeeperAuth from "../../../Models/shopkeeperAuth.js";
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';


const ListenRedeemCoupon = async (req, res) => {
  try {
        const mobile = req.user.mobile;
        const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

      console.log('mobile.', mobile);

     const Allredeemed = await redeemedCouponModel.find({ shopkeeper_mobile: mobile }).sort({ redeemedAt: -1 });
       if(!Allredeemed){
          return res.json({message:'Does Not exist Redeemed Coupon'});
     }
     
    
      const filteredCoupons = [];
      for (let left of Allredeemed) {
          console.log(left);
           const exists = await SaleCouponsModel.exists({
             coupon_id: left.coupon_id, customer_mobile:left.customer_mobile });
           console.log('exist', exists);
           if (!exists) {
             filteredCoupons.push(left); 
          }
    }

     return res.status(201).json({message: 'Coupon redeemed geted successfully',
       redeemed:filteredCoupons,
       });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default ListenRedeemCoupon;
