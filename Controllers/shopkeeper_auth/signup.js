
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import Joi  from 'joi';
import customersAuth from '../../Models/customerAuth.js';
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';


const shopkeeperSchema = Joi.object({
      business_name: Joi.string().trim().min(2).required(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
      .messages({message:'Mobile number must be exactly 10 digits'}),
      address: Joi.string().trim().min(2).required(),
      city: Joi.string().trim().min(2).required(),
      business_category:Joi.string().trim().required()
});



const signUpController = async (req, res) => {
  try {
      const { business_name, mobile, address, business_category, city } = 
            await shopkeeperSchema.validateAsync(req.body);

      const customer = await customersAuth.findOne({ mobile }).lean();
      if (customer) {
        return res.status(400).json({ error: 'Number already exists as a Customer' });
      }

      const shopkeeperExists = await ShopkeeperAuth.findOne({ mobile }).lean();
      if (shopkeeperExists) {
        return res.status(400).json({ error: 'Number already exists as a Shopkeeper' });
      }

      const RestaurantOwner = await RestaurantOwnerModel.findOne({ mobile }).lean();
      if (RestaurantOwner) {
          return res.status(400).json({ error: 'Number already exists as a Restaurant' });
      }

      const shopkeeperData = {
        business_name:business_name.toLowerCase(),           
        mobile,
        city: city.toLowerCase(),  
        address:address.toLowerCase(),         
        business_category: business_category.toLowerCase()
      };

      let createdAccount;

      if (business_category.toLowerCase() === 'restaurant') {
        createdAccount = await RestaurantOwnerModel.create(shopkeeperData);
      } else {
        createdAccount = await ShopkeeperAuth.create(shopkeeperData);
      }

      return res.status(201).json({ message: 'Account created successfully', account: createdAccount });

  } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: "Mobile number already registered" });
      }
      return res.status(500).json({ error: err, message: 'Server error' });
    }
};

export default signUpController;