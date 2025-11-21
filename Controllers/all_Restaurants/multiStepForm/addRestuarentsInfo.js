
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';
import RestaurantInfoModel from "../../../Models/restuarentActivitiesModels/restuarent_Info_Model.js"


const AddRestuarentsInfo = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

    // --- Handle Restaurant Info ---
    let restaurantsInfo = await RestaurantInfoModel.findOne({ restaurants_Owner: owner._id });

    const restaurantData = {
      restaurants_Owner: owner._id,
      restaurantName: req.body.restaurantName,
      ownerName: req.body.ownerName,
      email: req.body.email,
      mobile: req.body.mobile,
      whatsapp: req.body.whatsapp,
      daywiseTimings: req.body.daywiseTimings,
    };

    if (restaurantsInfo) {
      restaurantsInfo = await RestaurantInfoModel.findOneAndUpdate(
        { restaurants_Owner: owner._id },
         restaurantData,
        { new: true, runValidators: true }
      );
    } else {
      restaurantsInfo = new RestaurantInfoModel(restaurantData);
      await restaurantsInfo.save();
    }

    return res.status(200).json({message: "Restaurant_info saved successfully", restaurantsInfo});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", err });
  }
};

export default AddRestuarentsInfo;
