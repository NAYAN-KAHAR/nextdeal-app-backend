import customersAuth from '../../Models/customerAuth.js';
import NextOffersModel from '../../Models/shopkeeperActivitiesModels/nextOrderModel.js';
import redeemedCouponModel from  '../../Models/redeemedCouponModel.js'
import SaleCouponsModel from '../../Models/shopkeeperActivitiesModels/saleCouponsModel.js'

const getAllCustomerDetails = async (req, res) => {
  try {

    const customers = await customersAuth.find();
    if (!customers) {
      return res.status(404).json({ error: 'User not found' });
    }

    const couponGenerated = await NextOffersModel.find();
    const redeemedCoupon =  await redeemedCouponModel.find();
    const saleCoupon = await SaleCouponsModel.find();

    return res.status(200).json({
         message: 'Get user successfully',
         customers, couponGenerated,redeemedCoupon,saleCoupon
        });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllCustomerDetails;
