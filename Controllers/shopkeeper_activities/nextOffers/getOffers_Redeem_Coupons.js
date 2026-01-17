import redeemedCouponModel from "../../../Models/redeemedCouponModel.js";
import ShopkeeperAuth from "../../../Models/shopkeeperAuth.js";
import NextOffersModel from "../../../Models/shopkeeperActivitiesModels/nextOrderModel.js";

const fetchOfferAndRedeemCoupons = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    const [redeemCoupons, nextOffersCoupons, redeemCount, offerCount] =

      await Promise.all([
          redeemedCouponModel.find({ shopkeeper: shopkeeper._id  })
          .sort({ createdAt: -1 }).skip(skip).limit(limit).populate('coupon').lean(),

          NextOffersModel.find({ shopkeeper: shopkeeper._id  }).sort({ createdAt: -1 })
          .skip(skip).limit(limit).populate('coupon').lean(),

          redeemedCouponModel.countDocuments({ shopkeeper: shopkeeper._id }),
          NextOffersModel.countDocuments({ shopkeeper: shopkeeper._id  }),
      ]);

    return res.status(200).json({ message: 'Coupons fetched successfully',
       pagination: { page,limit, totalRedeemed: redeemCount,
        totalNextOffers: offerCount,
        totalPages: Math.ceil(Math.max(redeemCount, offerCount) / limit),},
       redeemCoupons, nextOffersCoupons,
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export default fetchOfferAndRedeemCoupons;
