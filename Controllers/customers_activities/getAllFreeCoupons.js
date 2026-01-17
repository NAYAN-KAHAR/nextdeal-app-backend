import FreeCoupon from '../../Models/shopkeeperActivitiesModels/freeCouponsModel.js';
import SaleCouponsModel from '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';
import customersAuth from '../../Models/customerAuth.js';

const getAllFreeCoupons = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // 🚀 Aggregate coupons with shopkeeper populated
    const allCoupons = await FreeCoupon.aggregate([
      { $match: { shopkeeper: { $ne: null } } }, // remove orphaned coupons
      {
        $lookup: {
          from: "shopkeepers",
          localField: "shopkeeper",
          foreignField: "_id",
          as: "shopkeeper"
        }
      },
      { $unwind: "$shopkeeper" }, // remove null references
      {
        $lookup: {
          from: "salecoupons", // check used coupons
          let: { couponId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$coupon_id", "$$couponId"] } } }
          ],
          as: "usedCoupons"
        }
      },
      { $match: { usedCoupons: { $size: 0 } } } // only unused coupons
    ]);

    if (!allCoupons.length) {
      return res.status(404).json({ error: 'No free coupons found' });
    }

    return res.status(200).json({
      message: 'Unused free coupons fetched successfully',
      allFreeCoupons: allCoupons
    });

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// const getAllFreeCoupons = async (req, res) => {
//   try {
//     const mobile = req.user.mobile;
//     // console.log('Customer Mobile:', mobile);
//     // console.log('mobile', mobile);
//     const customer = await customersAuth.findOne({ mobile }).lean();
//     if (!customer) {
//       return res.status(404).json({ error: 'Customer not found' });
//     }


//     const allFreeCoupons = await FreeCoupon.find().populate('shopkeeper').lean();
//     if (!allFreeCoupons.length) {
//       return res.status(404).json({ error: 'No free coupons found' });
//     }

  
//     const unusedCoupons = [];

//     for (const coupon of allFreeCoupons) {
//       const isUsed = await SaleCouponsModel.exists({coupon_id: coupon._id});

//       if (!isUsed) {
//         unusedCoupons.push(coupon);
//       }
//     }


//   return res.status(200).json({ message: 'Unused free coupons fetched successfully',
//      allFreeCoupons: unusedCoupons});

//   } catch (err) {
//     console.error('Server Error:', err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

export default getAllFreeCoupons;
