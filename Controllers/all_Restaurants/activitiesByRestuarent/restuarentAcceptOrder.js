
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';


const restuarentAcceptOrder = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const { isAcceptingOrders } = req.body;
    console.log(mobile, req.body);

    if (!mobile || typeof isAcceptingOrders === "undefined" ) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

   // Ensure the restaurant belongs to this owner (optional security check)
    const restaurant = await RestaurantOwnerModel.findOneAndUpdate(
      { _id:owner._id },
      { isAcceptingOrders },
      { new: true }
    );

    return res.status(200).json({
      message: `Restaurant is now ${isAcceptingOrders ? "accepting" : "not accepting"} orders.`,
      restaurant,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default restuarentAcceptOrder;
