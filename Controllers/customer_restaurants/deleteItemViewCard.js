
import customersAuth from "../../Models/customerAuth.js";
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";


const deleteFoodItemsViewCard = async (req, res) => {
  try {
    const mobile = req.user?.mobile;

    if (!mobile ) {
      return res.status(400).json({ error: "Customer is not authenticated " });
    }

    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const cartItem = await FoodItemsModel.deleteMany({});
    return res.status(200).json({ message: "Food items deleted successfully"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default deleteFoodItemsViewCard;
