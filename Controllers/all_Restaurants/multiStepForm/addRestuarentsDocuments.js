
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';
import RestaurantDocumentModel from '../../../Models/restuarentActivitiesModels/restaurantDocs Model.js'


const AddRestuarentsDocument = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body cannot be empty" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }


    let restaurantsDocs = await RestaurantDocumentModel.findOne({ restaurant: owner._id });
      
    const restaurantDocsData = {
      restaurant: owner._id,                
      outletType: req.body.outletType,      
      restaurantType: req.body.restaurantType,  
      pan: req.body.pan,
      gstin: req.body.gstin,
      bankIFSC: req.body.ifsc,
      bankAccountNumber: req.body.accountNumber,
    };

    if (restaurantsDocs) {
        restaurantsDocs = await RestaurantDocumentModel.findOneAndUpdate(
          { restaurant: owner._id },
          restaurantDocsData,
          { new: true, runValidators: true }
        );
    } else {
        restaurantsDocs = new RestaurantDocumentModel(restaurantDocsData);
        await restaurantsDocs.save();
    }

    return res.status(201).json({ message: "Restaurant_Docs saved successfully", restaurantsDocs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: " Server Error", err });
  }
};

export default AddRestuarentsDocument;
