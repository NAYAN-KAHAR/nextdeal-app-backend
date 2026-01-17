
import RecurringCouponModel  from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';

const saleCouponsCreate = async (req, res) => {
    try {
        const shopkeeperMobile = req.user.mobile;
        const {purchaseAmount,customerType,customer_mobile,discount,discountType,subtotal,
            coupon_id } = req.body;

         console.log(req.body);
        if(!purchaseAmount || !customerType || !customer_mobile || !discount
            || !discountType || !subtotal || !shopkeeperMobile || !coupon_id ){
          return res.status(404).json({ error: 'Fields are required'});
        }
        
       

        const hasShopkeeper = await ShopkeeperAuth.findOne({ mobile: shopkeeperMobile }).lean();
        if (!hasShopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        };
    
       let hasCoupon = (await FreeCoupon.findById(coupon_id))
                      || (await RecurringCouponModel.findById(coupon_id));
      
       if (!hasCoupon) {
         return res.status(404).json({ error: 'Coupon not found' });
       };
       
        const saleCoupons = new SaleCouponsModel({
         purchase_amount: purchaseAmount, 
         customerType, 
         customer_mobile,    
         shopkeeper_mobile:shopkeeperMobile,
         coupon_id,
         discount,
         discountType,
         subtotal
        });

        await saleCoupons.save();
        return res.status(201).json({ message: 'Next offer created successfully',saleCoupons});

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default saleCouponsCreate;
