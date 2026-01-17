import ShopkeeperAuth from '../../../Models/shopkeeperAuth.js';
import SaleCouponsModel from '../../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';

const getAllSalesCoupons = async (req, res) => {
  try {
      const mobile = req.user.mobile;
      const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();

      if (!shopkeeper) {
       return res.status(404).json({ error: 'Shopkeeper not found' });
      }

      const allCoupons = await SaleCouponsModel.find({ shopkeeper_mobile: shopkeeper.mobile }).lean();

      if(!allCoupons){
          return res.json({message:'No Coupons found'});
       }

      res.status(201).json({ message: 'Fetched sale Coupon successfully', allCoupons});
  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
  }
};

export default getAllSalesCoupons;


/*
const getAllSalesCoupons = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    // Pagination values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();

    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper not found' });
    }

    // Get total count
    const totalCoupons = await SaleCouponsModel.countDocuments({
      shopkeeper_mobile: shopkeeper.mobile,
    });

    // Get paginated data
    const allCoupons = await SaleCouponsModel.find({
      shopkeeper_mobile: shopkeeper.mobile,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      message: 'Fetched sale coupons successfully',
      currentPage: page,
      totalPages: Math.ceil(totalCoupons / limit),
      totalCoupons,
      allCoupons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

*/
