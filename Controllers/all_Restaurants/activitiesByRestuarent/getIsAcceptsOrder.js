
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';


const getIsAcceptingOrders = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }


    return res.status(200).json({message: "Restaurant accepting order",owner});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getIsAcceptingOrders;