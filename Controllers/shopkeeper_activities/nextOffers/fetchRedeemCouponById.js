import redeemedCouponModel from "../../../Models/redeemedCouponModel.js";
import ShopkeeperAuth from "../../../Models/shopkeeperAuth.js";

const fetchRedeemCouponById = async (req, res) => {
  try {
        const mobile = req.user.mobile;
        const { id }  = req.params;

        const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }
    
        if (!id) {
        return res.status(404).json({ error: 'id not found' });
        }

   
       const redeemed = await redeemedCouponModel.findById(id);
         if(!redeemed){
            return res.json({message:'Does Not exist Redeemed Coupon'});
        }

      return res.status(201).json({message: 'Coupon redeemed geted successfully', redeemed });
    } catch (error) {
      console.error('Redeem coupon error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

export default fetchRedeemCouponById;
