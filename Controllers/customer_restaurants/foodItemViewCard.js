// import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
// import customersAuth from "../../Models/customerAuth.js";
// import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
// import RestaurantOwnerModel from "../../Models/restuarentsModel.js";


// const addFoodItemsViewCard = async (req, res) => {
//   try {
//     const mobile = req.user?.mobile;
//     const data = req.body; // expects { foodSubCategoryId1: { count: 2 }, foodSubCategoryId2: { count: 1 } }

//     if (!mobile || Object.keys(data).length === 0) {
//        return res.status(400).json({ error: "Customer is not authenticated or data is empty" });
//     }

//     const customer = await customersAuth.findOne({ mobile });
//     if (!customer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     const existingCartItems = await FoodItemsModel.find({ userId: customer._id });

//     const insertedItems = [];

//     for (const [foodId, item] of Object.entries(data)) {
//       const subFood = await FoodSubCategory.findById(foodId);
//       if (!subFood) continue;


//     // Check if the user already has items from another restaurant
//     if (existingCartItems.length > 0) {
//       const existingRestaurantId = existingCartItems[0].restuarantId.toString();
//       if (existingRestaurantId !== subFood.restaurant.toString()) {
//          const restaurantName =  await RestaurantOwnerModel.findById(existingRestaurantId);
//          return res.status(400).json({restaurantName,
//           error: "You already have items from another restaurant. Please remove them before adding new items." 
//         });
//       }
//     }

//     // Check if this food is already in user's cart
//     let cartItem = await FoodItemsModel.findOne({
//         userId: customer._id,
//         FoodSubCategory: subFood._id,  
//       });

//     if (cartItem) {
//       // Increment count if exists
//       cartItem.count = item.count ;
//     } else {
//       // Create new cart item
//       cartItem = new FoodItemsModel({
//         userId: customer._id,
//         FoodSubCategory: subFood._id,
//         restuarantId:subFood.restaurant,
//         count: item.count || 1,
//       });
//     }

//     await cartItem.save();
//     insertedItems.push(cartItem);
//   }
//     return res.status(200).json({ message: "Food items added to cart successfully", insertedItems});
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server Error", err });
//   }
// };

// export default addFoodItemsViewCard;


import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
import customersAuth from "../../Models/customerAuth.js";
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";

const addFoodItemsViewCard = async (req, res) => {
  try {
    const mobile = req.user?.mobile;
    const data = req.body; // expects { foodSubCategoryId1: { count: 2 }, foodSubCategoryId2: { count: 1 } }

    if (!mobile || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Customer is not authenticated or data is empty" });
    }

    // Find the customer
    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Get all items currently in the user's cart
    const existingCartItems = await FoodItemsModel.find({ userId: customer._id });
    const insertedItems = [];

    // Loop through each food item being sent from frontend
    for (const [foodId, item] of Object.entries(data)) {
      const subFood = await FoodSubCategory.findById(foodId);
      if (!subFood) continue;

      //  Restaurant consistency check
      if (existingCartItems.length > 0) {
        const existingRestaurantId = existingCartItems[0].restuarantId.toString();
        if (existingRestaurantId !== subFood.restaurant.toString()) {
          const restaurantName = await RestaurantOwnerModel.findById(existingRestaurantId);
          return res.status(400).json({restaurantName,
            error: "You already have items from another restaurant. Please remove them before adding new items.",
          });
        }
      }

      //  Check if item already exists in cart
      let cartItem = await FoodItemsModel.findOne({
        userId: customer._id,
        FoodSubCategory: subFood._id,
      });

      // Auto-delete if count becomes 0
      if (item.count === 0) {
        if (cartItem) {
          await FoodItemsModel.deleteOne({
            userId: customer._id,
            FoodSubCategory: subFood._id,
          });
        }
        continue; // skip saving below
      }

      // Otherwise, update or create
      if (cartItem) {
        cartItem.count = item.count;
        await cartItem.save();
      } else {
        cartItem = new FoodItemsModel({
          userId: customer._id,
          FoodSubCategory: subFood._id,
          restuarantId: subFood.restaurant,
          count: item.count || 1,
        });
        await cartItem.save();
      }

      insertedItems.push(cartItem);
    }

    return res.status(200).json({message: "Food items updated successfully",insertedItems });
  } catch (err) {
    console.error("Error in addFoodItemsViewCard:", err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default addFoodItemsViewCard;
