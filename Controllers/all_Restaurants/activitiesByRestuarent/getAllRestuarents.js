import RestaurantLocationModel from '../../../Models/restuarentActivitiesModels/address_Location.js';
import FoodCategory from '../../../Models/restuarentActivitiesModels/foodCategoryModel.js';
import FoodSubCategory from '../../../Models/restuarentActivitiesModels/foodSubCategoryModel.js';
import redisClient from '../../../config/redis.js';
import mongoose from 'mongoose';


const getAllRestuarents = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const cacheKey = `restaurants_food_data:${latitude}:${longitude}`;

    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json({
        message: "Data coming from Redis",
        restaurants: parsedData.restaurants,
        Categories: parsedData.Categories,
        SubCategories: parsedData.SubCategories
      });
    }

    // Fetch nearby restaurants using aggregation and $lookup
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
        // Keep only ownerDetails
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

    console.log('restaurantsAggregation', restaurantsAggregation);

    // Collect nearby restaurant owner IDs
    const nearbyRestaurantIds = restaurantsAggregation.map(r => r._id);

    // Fetch only categories/subcategories for nearby restaurants
    const Categories = await FoodCategory.find({
      restaurant: { $in: nearbyRestaurantIds }
    }).lean();

    const SubCategories = await FoodSubCategory.find({
      restaurant: { $in: nearbyRestaurantIds }
    }).lean();

    // Combine data for Redis caching
    const dataToCache = {
      restaurants: restaurantsAggregation,
      Categories,
      SubCategories
    };

    // Cache for 30 minutes
    await redisClient.set(cacheKey, JSON.stringify(dataToCache), { EX: 60 * 30 });

    return res.status(200).json({
      message: "Restaurants and food data coming from MongoDB",
      restaurants: restaurantsAggregation,
      Categories,
      SubCategories
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getAllRestuarents;




// const getAllRestuarents = async (req, res) => {
//   try {
//     const { lat, lng } = req.query;
//     if (!lat || !lng) {
//       return res.status(400).json({ error: "Latitude and Longitude are required" });
//     }

//     const latitude = parseFloat(lat);
//     const longitude = parseFloat(lng);

//     // UNIQUE CACHE KEY BASED ON USER LOCATION
//     const cacheKey = `restaurants:${latitude}:${longitude}`;

//     // Try Redis Cache
//     const cachedData = await redisClient.get(cacheKey);
//     if (cachedData) {
//       const parsed = JSON.parse(cachedData);

//       const ownersOnly = parsed.map(item => item.restaurants_Owner);
//       return res.status(200).json({message:"Restaurants nearby from Redis",restaurants: ownersOnly});
//    }

//     // Fetch from MongoDB 
//     const owner = await RestaurantLocationModel.find({
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [longitude, latitude] },
//           $maxDistance: 16000 // 16km (5 miles)
//         }
//       }
//     }).populate("restaurants_Owner").lean();

//     if (!owner || owner.length === 0) {
//       return res.status(404).json({ error: "No nearby restaurants found" });
//     }

//     //Save to Redis for 30 minutes
//     await redisClient.set(cacheKey, JSON.stringify(owner), { EX: 60 * 30 });
//     const ownersOnly = owner.filter((item) => item.restaurants_Owner);

//     return res.status(200).json({message: "Restaurants nearby from MongoDB", restaurants: ownersOnly});

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server Error", err });
//   }
// };

// export default getAllRestuarents;