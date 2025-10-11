import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

const freeCouponLogic = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const allCoupons = await FreeCoupon.find({ shopkeeper: shopkeeper._id });

    let totalCoupons = 0;
    allCoupons.forEach(coupon => {
      totalCoupons += parseInt(coupon.freeCoupon);
    });

    const MAX_COUPONS = 15;
    const newCoupons = parseInt(req.body.freeCoupon);

    if (totalCoupons + newCoupons > MAX_COUPONS) {
      return res.status(403).json({
        error: `You can create only ${MAX_COUPONS - totalCoupons} more coupons.`,
        remaining: MAX_COUPONS - totalCoupons,
      });
    }

    // ✅ Generate multiple coupon documents
    const newCouponsArray = Array.from({ length: newCoupons }, () => ({
      shopkeeper: shopkeeper._id,
      couponName: req.body.couponName,
      discount: req.body.discount,
      discountType: req.body.discountType,
      spendingAmount: req.body.spendingAmount,
      freeCoupon: "1"
    }));

    const createdCoupons = await FreeCoupon.insertMany(newCouponsArray);

    return res.status(201).json({
      message: `${createdCoupons.length} coupon(s) created successfully`,
      createdCount: createdCoupons.length,
      coupons: createdCoupons
    });

  } catch (error) {
    console.error("Coupon creation error:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default freeCouponLogic;



// import FreeCoupon from '../../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
// import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';

// const freeCouponLogic = async (req, res) => {
//     try {
//         const mobile = req.user.mobile;
//           const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

//         if (!shopkeeper) {
//         return res.status(404).json({ error: 'Shopkeeper not found' });
//         }

//         const allCoupons = await FreeCoupon.find({ shopkeeper: shopkeeper._id });

//         let totalCoupons = 0;
//         allCoupons.forEach(coupon => {
//           totalCoupons += parseInt(coupon.freeCoupon);
//         });
//         const MAX_COUPONS = 15;
//         const newCoupons = parseInt(req.body.freeCoupon);

//         if (totalCoupons + newCoupons > MAX_COUPONS) {
//         return res.status(403).json({
//             error: `You can create only 
//             ${MAX_COUPONS - totalCoupons} more coupons.`,
//             remaining: MAX_COUPONS - totalCoupons,
//         });
//         }

//         const newCoupon = new FreeCoupon({
//         shopkeeper: shopkeeper._id,
//         ...req.body,
//         });

//         const savedCoupon = await newCoupon.save();
//         res.status(201).json({ message: 'Coupon created successfully', coupon: savedCoupon});


//   } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//   }
// };

// export default freeCouponLogic;


