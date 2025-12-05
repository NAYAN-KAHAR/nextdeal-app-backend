import FoodCategory from "../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"
import customersAuth from "../../Models/customerAuth.js"
import redisClient from "../../config/redis.js";
import RestaurantLocationModel from "../../Models/restuarentActivitiesModels/address_Location.js";

const AllFood99 = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const mobile = req.user?.mobile;

    if (!mobile) {
      return res.status(400).json({ error: "Customer is not authenticated" });
    }

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Validate customer exists
    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const cacheKey = `addon_data:${latitude}:${longitude}`;

    // Check Redis first
    // const cachedData = await redisClient.get(cacheKey);
    // if (cachedData) {
    //   const parsed = JSON.parse(cachedData);
    //   return res.status(200).json({
    //     message: "Data coming from Redis",
    //     restaurants: parsed.restaurants,
    //     Categories: parsed.Categories,
    //     SubCategories: parsed.SubCategories
    //   });
    // }

    // 🔥 Fetch nearby restaurants using geo aggregation
    const restaurantsAggregation = await RestaurantLocationModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: 16000,
          spherical: true
        }
      },
      {
        $lookup: {
          from: "restaurantsowners",
          localField: "restaurants_Owner",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: "$ownerDetails" },
      {
        $replaceRoot: { newRoot: "$ownerDetails" }
      },
      {
        $project: {
          _id: 1,
          business_name: 1,
          mobile: 1,
          address: 1,
          business_category: 1,
          isAcceptingOrders: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    if (!restaurantsAggregation || restaurantsAggregation.length === 0) {
      return res.status(404).json({ error: "No nearby restaurants found" });
    }

    // Extract owner IDs
    const nearbyRestaurantIds = restaurantsAggregation.map(r => r._id);

    // Fetch only categories of those nearby restaurants
      const Categories = await FoodCategory.find({
        restaurant: { $in: nearbyRestaurantIds }
      }).lean();

    const SubCategories = await FoodSubCategory.aggregate([
      {$match: { restaurant: { $in: nearbyRestaurantIds }}},
      {
        $match: {
          $expr: {  $lt: [ { $subtract: ["$price", { $ifNull: ["$Discount", 0] }] },  111] }
        }
    }
    ]);

    const dataToCache = {
      restaurants: restaurantsAggregation,
      Categories,
      SubCategories,
      
    };

    // Cache for 30 mins
    // await redisClient.set(cacheKey, JSON.stringify(dataToCache), { EX: 60 * 30 });

    return res.status(200).json({
      message: "Restaurants and addon food data coming from MongoDB",
      restaurants: restaurantsAggregation,
      Categories,
      nineTyNineFood:SubCategories
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default AllFood99;
