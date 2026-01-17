
import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import SaleCouponsModel from  '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js'


// const getAllFreeCoupons = async (req, res) => {
//   try {

//     const mobile = req.user.mobile;
//     const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).select('_id').lean();

//     if (!shopkeeper) {
//       return res.status(404).json({ error: 'Shopkeeper not found' });
//     }

//    const coupons = await FreeCoupon.aggregate([
//       { $match: { shopkeeper: { $ne: null } } },
//         {
//           $lookup: {
//             from: "shopkeepers",
//             localField: "shopkeeper",
//             foreignField: "_id",
//             as: "shopkeeper"
//           }
//         },
//         { $unwind: "$shopkeeper" }
//       ]);

//       const usedCouponIds = await SaleCouponsModel.distinct("coupon_id", { shopkeeper_mobile: mobile });
//       const filteredCoupons = coupons.filter(c => !usedCouponIds.some(id => id.equals(c._id)));

//       return res.status(200).json({
//         message: 'Fetched coupons successfully',
//         allCoupons: filteredCoupons
//       });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

// export default getAllFreeCoupons;




const getAllFreeCoupons = async (req, res) => {
    try {
        const mobile = req.user.mobile;
        const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();

        if (!shopkeeper) {
        return res.status(404).json({ error: 'Shopkeeper not found' });
        }

        const allCoupons = await FreeCoupon.find({ shopkeeper: shopkeeper._id });
         if(!allCoupons){
           return res.json({message:'No Coupons found'});
         }

        const filteredCoupon = [];
        for(let coupon of allCoupons){
            console.log('coupon', coupon);
            const exists = await SaleCouponsModel.exists({
                 coupon_id:coupon._id,
                 shopkeeper_mobile:mobile,
             });
             console.log('exists', exists);
             if(!exists){
                filteredCoupon.push(coupon);
             }
        }

        res.status(201).json({ message: 'Fetched Coupon successfully', allCoupons:filteredCoupon});

  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getAllFreeCoupons;


