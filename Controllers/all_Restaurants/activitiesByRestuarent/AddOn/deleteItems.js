
import AddOnModel from "../../../../Models/restuarentActivitiesModels/addOn_Model.js"
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";


const deleteAddOnItem = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile || !req.params.id) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

    await AddOnModel.findByIdAndDelete({_id:req.params.id})
    return res.status(200).json({message: "Sub-Category deleted successfully"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default deleteAddOnItem;

