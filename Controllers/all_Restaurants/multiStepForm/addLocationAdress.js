
import RestaurantOwnerModel from '../../../Models/restuarentsModel.js';
import RestaurantLocationModel from '../../../Models/restuarentActivitiesModels/address_Location.js';


const AddressLocationRestuarents = async (req, res, next) => {
  try {
      const mobile = req.user.mobile;
      if(!req.body){
          return res.status(404).json({ error: 'address required' });
      }
      const hasRestuarent = await RestaurantOwnerModel.findOne({ mobile })
         if (!hasRestuarent) {
           return res.status(404).json({ error: 'hasRestuarent not found' });
         };
         

    const existingLocation = await RestaurantLocationModel.findOne({
                    restaurants_Owner: hasRestuarent._id });

    let savedLocation;

    if (existingLocation) {

      savedLocation = await RestaurantLocationModel.findOneAndUpdate(
        { restaurants_Owner: hasRestuarent._id },
        { ...req.body },
        { new: true, runValidators: true } 
      );
        return res.status(200).json({ message: "Location updated successfully",
          savedLocation });
    }
     else {
        const newLocation = new RestaurantLocationModel({
        ...req.body,
        restaurants_Owner: hasRestuarent._id,
        });

        const savedLocation = await newLocation.save();
        return res.status(201).json({message:'location added successfully', savedLocation});
    }
   } catch (err) {
     return res.status(500).json({ error: 'Internal Server Error', err});
   }
};

export default AddressLocationRestuarents;