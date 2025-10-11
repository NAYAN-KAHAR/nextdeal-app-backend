import redeemedCouponModel from '../../Models/redeemedCouponModel.js';


const PushCustomefreeRedeemCoupon = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const {couponName, coupon_id, shopkeeper_mobile,
         discount, discountType, spendingAmount } = req.body;
    
        console.log(req.body);

    if (!couponName || !mobile || !coupon_id || !shopkeeper_mobile 
        || !discount || !discountType || !spendingAmount) {
      return res.status(400).json({ error: 'All fields are required' });
    }
   
    const alreadyRedeemCoupon = await redeemedCouponModel.findOne({ coupon_id:coupon_id });
    if(alreadyRedeemCoupon){
        return res.json({message:'Already Redeemed Coupon'});
    }

    // Save to DB
    const redeemed = await redeemedCouponModel.create({
      couponName,
      customer_mobile:mobile,
      coupon_id,
      shopkeeper_mobile,
      discount,
      discountType,
      spendingAmount,
      delivered: false
    });

    return res.status(201).json({message: 'Coupon redeemed successfully', redeemed });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default PushCustomefreeRedeemCoupon;
