import mongoose from 'mongoose';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import RecurringCouponModel from '../../Models/shopkeeperActivitiesModels/recurringCouponModel.js';
import SaleCouponsModel from  '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';



const getPerShopDetails = async (req, res) => {
  try {
    const { shopkeeperId } = req.params; 
    if (!shopkeeperId) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const shopkeeper = await ShopkeeperAuth.findById(shopkeeperId);
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }
    // console.log('shopkeeperId:', shopkeeper._id);
  
     const getFreeCoupons = await FreeCoupon.find(
      { shopkeeper:  new mongoose.Types.ObjectId(shopkeeper._id )});

    //  const getRecurringCoupons = await RecurringCouponModel.find({ shopkeeper:  new mongoose.Types.ObjectId(shopkeeper._id )});

     if (getFreeCoupons.length === 0) {
         return res.json({shopkeeper, message: 'Free coupon not found' });
     }
   const filteredCoupon = [];

        for(let coupon of getFreeCoupons){
            console.log('coupon', coupon);
            const exists = await SaleCouponsModel.exists({
                 coupon_id:coupon._id,
                 shopkeeper_mobile:shopkeeper.mobile,
             });
             console.log('exists', exists);
             if(!exists){
                filteredCoupon.push(coupon);
             }
        }
    return res.status(200).json({ message: 'Get user successfully',
         shopkeeper, getFreeCoupons:filteredCoupon });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getPerShopDetails;
