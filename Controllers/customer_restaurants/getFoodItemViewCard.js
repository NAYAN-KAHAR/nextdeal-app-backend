
import customersAuth from "../../Models/customerAuth.js";
import FoodSubCategorySchema from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";

const getFoodItemsViewCard = async (req, res) => {
  try {
    const mobile = req.user?.mobile;

    if (!mobile ) {
      return res.status(400).json({ error: "Customer is not authenticated " });
    }

    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }


    const cartItem = await FoodItemsModel.find({userId:customer._id});
    if (!cartItem) {
      return res.status(404).json({ error: "cartItem not found" });
    }

    return res.status(200).json({ message: "Food items gets successfully", cartItem});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getFoodItemsViewCard;
