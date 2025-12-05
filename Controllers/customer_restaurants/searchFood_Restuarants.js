
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

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const results = await FoodSubCategory.aggregate([
     {
       $match: { $text: { $search: name } }
     },

     {
      $lookup: {
        from: "restaurantsowners",
        localField: "restaurant",
        foreignField: "_id",
        as: "restaurant"
      }
    },
    { $unwind: "$restaurant" }
  ]);

    console.log(results);

    const allRestuarants = results.map((v) => v.restaurant).filter(Boolean)
     //keeps only truthy values and removes falsy ones

    return res.status(200).json({ message: "Food items gets successfully123",
                                  allSubFoods:results, allRestuarants});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default SearchFoodRestuarants;


