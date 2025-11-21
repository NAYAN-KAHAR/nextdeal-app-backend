import customersAuth from "../../Models/customerAuth.js"
import FoodCategory from "../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"
import RestaurantOwnerModel from "../../Models/restuarentsModel.js"


const getSpecificFoodsRestuarent = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile || !req.params.id) {
      return res.status(400).json({ error: "customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
        return res.status(404).json({ error: "customer owner not found" });
    }
    const restaurantOwner = await RestaurantOwnerModel.findById(req.params.id);
    const foodCategories = await FoodCategory.find({ restaurant: req.params.id });
    const foodSubCategory = await FoodSubCategory.find({ restaurant: req.params.id });

    if (!foodCategories) {
        return res.status(404).json({ error: "restuarent not found" });
    }

    return res.status(200).json({message: "gets food and subfood successfully",
         restaurantOwner, foodCategories, foodSubCategory});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getSpecificFoodsRestuarent;
