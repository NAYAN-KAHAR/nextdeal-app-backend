
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import FoodSubCategory from "../../../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"


const getAllSubCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile ) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

    const updatedData = await FoodSubCategory.find({ restaurant: owner._id});
    return res.status(200).json({message: "Sub category getting successfully", updatedData});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getAllSubCategory;

