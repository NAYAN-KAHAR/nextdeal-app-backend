
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';
import RestaurantInfoModel from "../../../Models/restuarentActivitiesModels/restuarent_Info_Model.js"
import RestaurantDocumentModel from "../../../Models/restuarentActivitiesModels/restaurantDocs Model.js";
import RestaurantLocationModel from "../../../Models/restuarentActivitiesModels/address_Location.js";


const getMiltiStepFormData = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }


    const restaurantsAddress = await RestaurantLocationModel.findOne({ restaurants_Owner: owner._id });
    const restaurantsInfo = await RestaurantInfoModel.findOne({ restaurants_Owner: owner._id });
    const restaurantsDocs = await RestaurantDocumentModel.findOne({ restaurant: owner._id });

    return res.status(200).json({message: "Restaurant details geted successfully",owner,
                                 restaurantsAddress, restaurantsInfo, restaurantsDocs
                                 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getMiltiStepFormData;
