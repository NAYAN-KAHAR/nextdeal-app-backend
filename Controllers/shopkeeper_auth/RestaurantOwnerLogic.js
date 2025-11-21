

import ShopkeeperAuth from "../../Models/shopkeeperAuth.js";
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";
import Subscription from "../../Models/subscriptionModel.js";


import dotenv from 'dotenv';
dotenv.config(); 


const RestaurantOwnerLogic = async (req, res) => {
  try {
    const { plan } = req.body;
    const mobile = req.user?.mobile;
    console.log('mobile', req.body, mobile);

    if (!mobile || !plan) return res.status(401).json({ error: "Unauthorized user" });
    

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) return res.status(404).json({ error: "Shopkeeper not found" });

    const subscribe =  await Subscription.findOne({ shopkeeper:shopkeeper._id });
    if(subscribe){
        return res.status(404).json({ error: "Shopkeeper is not restuarent related" });
    }
    // For 'restaurant' plan, don't create any subscription
      if (plan === 'restuarents') {
          const restaurantsOwner = new  RestaurantOwnerModel({
            business_name:shopkeeper.business_name,
            mobile:shopkeeper.mobile,
            address:shopkeeper.address,
            business_category:shopkeeper.business_category
          });
        const data = await restaurantsOwner.save()
        return res.status(200).json({ message:"Restaurant plan selected", data });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default RestaurantOwnerLogic;
