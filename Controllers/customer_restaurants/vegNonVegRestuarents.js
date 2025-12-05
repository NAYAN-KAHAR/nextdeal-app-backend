import customersAuth from "../../Models/customerAuth.js"
import RestaurantDocumentModel from '../../Models/restuarentActivitiesModels/restaurantDocs Model.js'


const getVegNonVegRestuarents = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    let { selectVegType }  = req.params;

    if (!mobile ) {
      return res.status(400).json({ error: "customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
        return res.status(404).json({ error: "customer owner not found" });
    }

      // console.log('selectVegType =>',selectVegType.trim());

      selectVegType = selectVegType.trim();
      console.log('selectVegType', selectVegType);
    
      // Build filter
      let vegFilter = {};

      if (selectVegType === "All restaurants") {
        vegFilter = { restaurantType: { $in: ["mixed", "pure_veg"] } };

      }else if(selectVegType=== "Non-Veg"){
        vegFilter = { restaurantType: { $in: ["mixed", "pure_nonveg"] } };
      } 
      else {
        vegFilter = { restaurantType: "pure_veg" };
      }

      const restaurants = await RestaurantDocumentModel.aggregate([
        { $match: vegFilter },

        {
          $lookup: {
            from: "restaurantsowners",  // must be lowercase plural
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
          },
        },

        { $unwind: "$restaurant" }
      ]);


    return res.status(200).json({message: "Veg/Nov Veg Foods getting successfully",restaurants});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getVegNonVegRestuarents;

