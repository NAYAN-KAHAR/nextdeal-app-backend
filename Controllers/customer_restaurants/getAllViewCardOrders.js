import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
import customersAuth from "../../Models/customerAuth.js";
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";

const getAllViewCardOrders = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile) {
        return res.status(400).json({ error: "Customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const foodItems = await FoodItemsModel.find({ userId: customer._id })
      .populate("FoodSubCategory") // 🍲 brings full food info
      .populate("restuarantId");   // 🍽️ brings restaurant info too

    if (foodItems.length === 0) {
      return res.status(200).json({ message: "No cart items found" });
    }

    return res.status(200).json({message: "Cart items fetched successfully",foodItems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
};

export default getAllViewCardOrders;

