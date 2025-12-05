import mongoose from 'mongoose';
import RestaurantLocationModel from '../../Models/restuarentActivitiesModels/address_Location.js';


const orderDistanceMessurement = async (req,res) => {
    console.log('address',req.body);

    const mobile = req.user?.mobile;
   
    const { latitude, longitude, restuarantId} = req.body;
    console.log(latitude, longitude, restuarantId);

    try{

     if (!mobile) {
      return res.status(400).json({ error: "Customer is not authenticated" });
    }

     if (!req.body) {
      return res.status(400).json({ error: "Address or Restuarant is missing." });
    }

    // Calculate distance (Customer → Restaurant)
    const restaurantDistance = await RestaurantLocationModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          distanceField: "distance",
          spherical: true,
          query: { restaurants_Owner:new mongoose.Types.ObjectId(restuarantId) }
        }
      },
      { $limit: 1 } // required in MongoDB 7+
    ]);
    console.log('restaurantDistance', restaurantDistance);

    if (!restaurantDistance.length) {
      return res.status(404).json({ error: "Restaurant location not found." });
    }

    const distanceKm = restaurantDistance[0].distance / 1000;

    // more than 16km → reject order
    if (distanceKm > 16) {
      return res.status(400).json({
        error: "Restaurant is more than 16km away. Delivery not available.",
        distance: distanceKm
      });
    };

    let deliveryFee = 20;
    if (distanceKm > 3) {
      deliveryFee += Math.ceil(distanceKm - 3) * 10;
    }


    return res.status(201).json({ message: "Address gets successfully!",
        distance: distanceKm, deliveryFee});

    }catch(err){
        console.log(err);
        res.send({status:500, message:'Internal server error'});
    }
}

export default orderDistanceMessurement;