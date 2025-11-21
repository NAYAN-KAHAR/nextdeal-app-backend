import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';
import RestaurantLocationModel from '../../../Models/restuarentActivitiesModels/address_Location.js';
import redisClient from '../../../config/redis.js';


const getAllRestuarents = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // UNIQUE CACHE KEY BASED ON USER LOCATION
    const cacheKey = `restaurants:${latitude}:${longitude}`;

    // Try Redis Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);

      const ownersOnly = parsed.map(item => item.restaurants_Owner);
      return res.status(200).json({message:"Restaurants nearby from Redis",restaurants: ownersOnly});
   }

    // Fetch from MongoDB 
    const owner = await RestaurantLocationModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 16000 // 16km (5 miles)
        }
      }
    }).populate("restaurants_Owner").lean();

    if (!owner || owner.length === 0) {
      return res.status(404).json({ error: "No nearby restaurants found" });
    }

    //Save to Redis for 30 minutes
    await redisClient.set(cacheKey, JSON.stringify(owner), { EX: 60 * 30 });
    const ownersOnly = owner.filter((item) => item.restaurants_Owner);

    return res.status(200).json({message: "Restaurants nearby from MongoDB", restaurants: ownersOnly});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getAllRestuarents;