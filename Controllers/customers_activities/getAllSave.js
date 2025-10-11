
import CustomerAuth from '../../Models/customerAuth.js';
import SaleCouponsModel from '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';

const getAllSaves = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const customer = await CustomerAuth.findOne({ mobile });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const allSaves = await SaleCouponsModel.find({ customer_mobile: customer.mobile });

    if (allSaves.length === 0) {
      return res.status(200).json({ message: 'No Coupons found', data: [] });
    }

  const combinedResults = [];

    for (const coupon of allSaves) {
      const shopkeeper = await ShopkeeperAuth.findOne({ mobile: coupon.shopkeeper_mobile });

      combinedResults.push({
        coupon,
        shopkeeper: shopkeeper
          ? {
              business_name: shopkeeper.business_name,
            
            }
          : null,
      });
    }

    res.status(200).json({
      message: 'Fetched coupons successfully',
      data: combinedResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export default getAllSaves;


// const filteredCoupons = [];

//         for (const offer of myCoupons) {
//             const isUsed = await SaleCouponsModel.exists({
//               coupon_id: offer.coupon?._id,
//               shopkeeper_mobile: offer.shopkeeper?.mobile,
//             });

//             if (!isUsed) {
//               filteredCoupons.push(offer);
//             }
//           }