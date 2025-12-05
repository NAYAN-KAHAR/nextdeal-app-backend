import mongoose from "mongoose";
import OrderModel from '../../Models/restuarentActivitiesModels/orderPlaceModel.js';
import customersAuth from '../../Models/customerAuth.js';
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";

const checkoutGetFoodData = async (req,res) => {
    const mobile = req.user?.mobile;
    try{

      if (!mobile) return res.status(400).json({ error: "Customer not authenticated" });
      const customer = await customersAuth.findOne({mobile:mobile}).lean();
      if (!customer) return res.status(400).json({ error: "Customer not find" });

      const checkoutData = await OrderModel.findOne({customerId:customer._id})
      .populate('restaurantId').lean();
      return res.json({status:200, message:'gets checkout data', checkoutData});

    }catch(err){
        console.log(err);
    }
}

export default checkoutGetFoodData;