
import AddOnModel from "../../../../Models/restuarentActivitiesModels/addOn_Model.js"
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";


const getAllAddOnsItems = async (req, res) => {
 
  try {
    const mobile = req.user.mobile;

    if (!mobile ) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

    const addOnsData = await AddOnModel.find({ restaurant: owner._id}).lean();
    return res.status(200).json({ message: "Add-Ons getting successfully", addOnsData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};



export default getAllAddOnsItems;