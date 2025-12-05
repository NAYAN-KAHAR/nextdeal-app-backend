import RestaurantOwnerModel from "../../Models/restuarentsModel.js";
import AddOnModel from '../../Models/restuarentActivitiesModels/addOn_Model.js';

const getAddOnsItems = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const owner = await RestaurantOwnerModel.findById(restaurantId).lean();
    if (!owner) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
  

    const addOnsData = await AddOnModel.find({ restaurant: owner._id.toString() }).lean();
    console.log('addOnsData', addOnsData);


    if (!addOnsData || addOnsData.length === 0) {
      return res.status(200).json({ message: "No add-on items found", addOnsData: [] });
    }

    return res.status(200).json({
      message: "Add-on items fetched successfully",
      addOnsData
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
};

export default getAddOnsItems;
