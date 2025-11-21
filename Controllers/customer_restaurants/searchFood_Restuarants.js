
import customersAuth from "../../Models/customerAuth.js";
import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";
import RestaurantOwnerModel from "../../Models/restuarentsModel.js";


const SearchFoodRestuarants = async (req, res) => {
  try {
    const mobile = req.user?.mobile;
    const { name } = req.params;

    if (!mobile || !name ) {
      return res.status(400).json({ error: "Customer is not authenticated " });
    }

    const customer = await customersAuth.findOne({ mobile });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }


    // 👇 Use regex for partial, case-insensitive match
    const searchRegex = new RegExp(name, "i"); // 'i' = ignore case

    const allSubFoods = await FoodSubCategory.find({
      name: { $regex: searchRegex }
    }).populate("restaurant");


    console.log(allSubFoods);
    const allRestuarants = allSubFoods.map((v) => v.restaurant).filter(Boolean)
     //keeps only truthy values and removes falsy ones

    return res.status(200).json({ message: "Food items gets successfully", allSubFoods, allRestuarants});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default SearchFoodRestuarants;


/*
const SearchFoodRestaurants = async (req, res) => {
  try {
    const { name } = req.params;
    const page = Number(req.query.page || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    if (!req.user?.mobile || !name) {
      return res.status(400).json({ error: "Customer not authenticated" });
    }

    // NO NEED to fetch customer from DB — decode from JWT instead
    // const customer = await customersAuth.findOne({ mobile });

    const results = await FoodSubCategory.aggregate([
      { $match: { $text: { $search: name } } },
      {
        $lookup: {
          from: "restaurantownermodels",
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      { $unwind: "$restaurant" },
      { $skip: skip },
      { $limit: limit }
    ]);

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: "Server Error", err });
  }
};

*/
