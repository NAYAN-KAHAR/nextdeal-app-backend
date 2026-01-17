
import RecurringCouponModel  from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import customersAuth from '../../../Models/customerAuth.js';
import NextOffersModel from '../../../Models/shopkeeperActivitiesModels/nextOrderModel.js';


const NextOfferCreate = async (req, res) => {
    try {
        const shopkeeperMobile = req.user.mobile;

        const {mobile, offer } = req.body; 
        // console.log(req.body);
   
        if(!mobile || !offer){
          return res.status(404).json({ error: 'Fields are required'});
        }
        
        const  [hasShopkeeper, hasCustomer, selectedCoupon] =  await Promise.all([
            ShopkeeperAuth.findOne({ mobile: shopkeeperMobile }).lean(),
            customersAuth.findOne({ mobile }).lean(),
            RecurringCouponModel.findById(offer).lean(),
        ])
       
        if (!hasShopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        };
        if (!hasCustomer) {
          return res.status(404).json({ error: 'Customer Mobile Number Not Found' });
        };
        if (!selectedCoupon) {
        return res.status(404).json({ error: 'Recurring coupon not found' });
        }

        // 4. Create next offer for the customer
        const nextOffer = new NextOffersModel({
         shopkeeper: hasShopkeeper._id, 
         customer_mobile: mobile,       
         coupon: selectedCoupon._id,
         discount: selectedCoupon.discount,
         discountType: selectedCoupon.discountType,
        });

        await nextOffer.save();
        return res.status(201).json({ message: 'Next offer created successfully',offer: nextOffer,});

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default NextOfferCreate;