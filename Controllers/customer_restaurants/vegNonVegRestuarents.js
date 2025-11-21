import customersAuth from "../../Models/customerAuth.js"
import RestaurantDocumentModel from '../../Models/restuarentActivitiesModels/restaurantDocs Model.js'


const getVegNonVegRestuarents = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const { selectVegType }  = req.params;

    if (!mobile ) {
      return res.status(400).json({ error: "customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
        return res.status(404).json({ error: "customer owner not found" });
    }

     { selectVegType: 'All restaurants' }
     { selectVegType: 'Pure veg restaurants only' }
      let restuarents;
      if(selectVegType === 'All restaurants'){
          restuarents = await RestaurantDocumentModel.find({restaurantType:'mixed'}).
          populate('restaurant').lean();
      }else{
          restuarents = await RestaurantDocumentModel.find({restaurantType:'pure_veg'})
          .populate('restaurant').lean();
      }

    // const matchStage = {
    //   restaurantType: selectVegType === 'All restaurants' ? 'mixed' : 'pure_veg'
    // };

    // const restuarents = await RestaurantDocumentModel.aggregate([
    //   { $match: matchStage },
    //   {
    //     $lookup: {
    //       from: "RestaurantsOwner",
    //       localField: "restaurant",
    //       foreignField: "_id",
    //       as: "restaurant"
    //     }
    //   },
    //   { $unwind: "$restaurant" }
    // ])
    // console.log(restuarents);

    return res.status(200).json({message: "Category getting successfully",restuarents});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getVegNonVegRestuarents;

