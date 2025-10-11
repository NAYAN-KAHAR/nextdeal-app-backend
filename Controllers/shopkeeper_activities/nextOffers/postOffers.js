
import RecurringCouponModel  from '../../../Models/shopkeeperActivitiesModels/recurringCouponModel.js'
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import customersAuth from '../../../Models/customerAuth.js';
import NextOffersModel from '../../../Models/shopkeeperActivitiesModels/nextOrderModel.js';

const NextOfferCreate = async (req, res) => {
    try {
        const shopkeeperMobile = req.user.mobile;

        const {mobile, offer } = req.body; 
        console.log(req.body);
   

        if(!mobile || !offer){
          return res.status(404).json({ error: 'Fields are required'});
        }
        

        const hasShopkeeper = await ShopkeeperAuth.findOne({ mobile: shopkeeperMobile });

        if (!hasShopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        };

        const hasCustomer = await customersAuth.findOne({ mobile })

        if (!hasCustomer) {
          return res.status(404).json({ error: 'Customer not found' });
        };


        const selectedCoupon = await RecurringCouponModel.findById(offer);
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
