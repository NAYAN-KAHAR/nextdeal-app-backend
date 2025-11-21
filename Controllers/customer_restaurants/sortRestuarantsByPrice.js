import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";


const sortRestuarantsByPrice = async (req, res) => {
  try {
    const mobile = req.user?.mobile;
    const sortQuery = req.params.query;

    if (!mobile || !sortQuery) {
      return res.status(400).json({ error: "Customer is not authenticated/Query is required" });
    }

    let sortOption = sortQuery === 'High' ? 1:-1;

    // const items = await FoodSubCategory.find().sort({price:sortOption}).populate('restaurant').lean();

    // const seen = new Set();
    // const uniqueRestaurants = [];

    // for (const item of items) {
    //   const restId = item.restaurant?._id?.toString();

    //   if (!seen.has(restId)) {
    //     seen.add(restId);
    //     uniqueRestaurants.push(item.restaurant);
    //   }
    // }

    // 1) Sort food items by price
    const result = await FoodSubCategory.aggregate([
      { $sort: { price: sortOption } },

      // 2) Pick first item for each restaurant
      {
        $group: {
          _id: "$restaurant",
          item: { $first: "$$ROOT" }
        }
      },

      // 3) Lookup restaurant details
      {
        $lookup: {
          from: "restaurantsowners",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant"
        }
      },

      // 4) Unwind single restaurant
      { $unwind: "$restaurant" },

      // 5) Return only restaurant object (remove food item)
      {
        $replaceRoot: {
          newRoot: "$restaurant"
        }
      }
    ])

    return res.status(200).json({sorted: result,count: result.length });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};



export default sortRestuarantsByPrice;