import OrderModel from '../../../Models/restuarentActivitiesModels/orderPlaceModel.js';
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';


const getAllCustomersOrders = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if(!mobile){
        return res.status(401).json({error:'restauants mobile is missing'});
    };

    const restuarant = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!restuarant) {
      return res.status(404).json({ error: 'restuarant is not found' });
    }

   console.log('restuarant', restuarant)
   const orders = await OrderModel.find({restaurantId: restuarant._id}).sort({ orderedAt: -1 }).lean();

   return res.status(200).json({ message: 'orders fetched successfully', orders});

  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getAllCustomersOrders;
