import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
import customersAuth from "../../Models/customerAuth.js";
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";
import FoodCategory from '../../Models/restuarentActivitiesModels/foodCategoryModel.js';
import AddOnModel from "../../Models/restuarentActivitiesModels/addOn_Model.js";



const getAllViewCardOrders = async (req, res) => {
  try {
    const mobile = req.user?.mobile;

    if (!mobile) {
      return res.status(400).json({ error: "Customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Fetch all cart items for the user with aggregation
    const foodItems = await FoodItemsModel.aggregate([
      { $match: { userId: customer._id } },

      // Lookup FoodSubCategory
      {
        $lookup: {
          from: "foodsubcategories",
          localField: "FoodSubCategory",
          foreignField: "_id",
          as: "FoodSubCategory"
        }
      },
      { $unwind: { path: "$FoodSubCategory", preserveNullAndEmptyArrays: true } },

      // Lookup AddOn
      {
        $lookup: {
          from: "addonmodels",
          localField: "addOnId",
          foreignField: "_id",
          as: "addOn"
        }
      },
      { $unwind: { path: "$addOn", preserveNullAndEmptyArrays: true } },

      // Lookup RestaurantsOwner
      {
        $lookup: {
          from: "restaurantsowners",
          localField: "restuarantId",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      { $unwind: "$restaurant" }
    ]);

    if (!foodItems.length) {
      return res.status(200).json({ message: "No cart items found", foodItems: [], recommdationFoods: [], addOns: [] });
    }

    // Get unique categories for recommendations
    const categories = [
      ...new Set(foodItems
        .map(item => item.FoodSubCategory?.FoodCategory?.toString())
        .filter(Boolean))
    ];

    // Get unique restaurant IDs in cart
    const restaurantIds = [
      ...new Set(foodItems.map(item => item.restaurant._id.toString()))
    ];

    console.log('restaurantIds', restaurantIds);
    const restuarant = await RestaurantOwnerModel.findById(restaurantIds[0]).lean();
    if(!restuarant){
       return res.status(200).json({ message: "No resturant found" }); 
    }

    // Fetch recommended foods (exclude items already in cart)
    const recommdationFoods1 = await FoodSubCategory.find({
      FoodCategory: { $in: categories }
    });
    const finalData1 = recommdationFoods1.filter(rec =>
      !foodItems.some(item => item.FoodSubCategory?._id.toString() === rec._id.toString())
    );

    // Fetch add-ons for restaurants (exclude items already in cart)
    const recommdationFoods2 = await AddOnModel.find({
      restaurant: { $in: restaurantIds }
    });
    const finalData2 = recommdationFoods2.filter(rec =>
      !foodItems.some(item => item.addOnId && item.addOnId.toString() === rec._id.toString())
    );

    return res.status(200).json({ message: "Cart items fetched successfully",
                foodItems, recommdationFoods: finalData1, addOns: finalData2, restuarant });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", details: err.message });
  }
};

export default getAllViewCardOrders;
