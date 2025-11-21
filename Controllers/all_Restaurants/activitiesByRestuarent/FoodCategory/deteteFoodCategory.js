import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";


const deleteCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile || !req.params.id) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

    const updatedData = await FoodCategory.findByIdAndDelete({_id:req.params.id})
    return res.status(200).json({message: "Category deleted successfully", updatedData});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default deleteCategory;

