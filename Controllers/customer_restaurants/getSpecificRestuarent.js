import customersAuth from "../../Models/customerAuth.js"
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';
import RestaurantLocationModel from '../../Models/restuarentActivitiesModels/address_Location.js';


const getSpecificRestuarent = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile || !req.params.id) {
      return res.status(400).json({ error: "customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
        return res.status(404).json({ error: "customer owner not found" });
    }

    const restuarent = await RestaurantOwnerModel.findById(req.params.id).lean();
    if (!restuarent) {
        return res.status(404).json({ error: "restuarent not found" });
    }
  
    const location = await RestaurantLocationModel.findOne({ restaurants_Owner: restuarent._id }).lean();

    const recommendedRestaurants = await RestaurantLocationModel.aggregate([
      {$match: {city:location.city, restaurants_Owner: {$ne:restuarent._id} }},
      {
        $lookup: {
        from: "restaurantsowners", 
        localField: "restaurants_Owner",
        foreignField: "_id",
        as: "restaurant"
      }
      },
      {$unwind:'$restaurant'},
      {$limit:5}
    ])

    return res.status(200).json({ message: "Restaurant retrieved successfully",
                                  restuarent, recommendedRestaurants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getSpecificRestuarent;
