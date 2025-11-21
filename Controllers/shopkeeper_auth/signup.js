
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import bcrypt from 'bcrypt';
import Joi  from 'joi';
import customersAuth from '../../Models/customerAuth.js';


const shopkeeperSchema = Joi.object({
      business_name: Joi.string().trim().min(2).required(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
      .messages({message:'Mobile number must be exactly 10 digits'}),
      address: Joi.string().trim().min(2).required(),
      business_category:Joi.string().trim().required()
});


const signUpController = async (req, res) => {
  try {
   
    const { business_name, mobile, address, business_category } = await shopkeeperSchema.validateAsync(req.body);
    // console.log('req body :', req.body);
  
    const customer = await customersAuth.findOne({ mobile }).lean();
    if(customer){
       return res.status(400).json({ error: 'Number already exists as a Customer' });
    } 
    
    const shopkeeperData = {
      business_name: business_name.toLowerCase(),
      mobile,
      address:address.toLowerCase(),
      business_category: business_category.toLowerCase(),
    };

    const shopkeeper = await ShopkeeperAuth.create(shopkeeperData);
    return res.status(201).json({ message: 'Account created successfully', shopkeeper });

  } catch (err) {
    console.error(err);
     if (err.code === 11000) {
      return res.status(400).json({ error: "Mobile number already registered" });
    }
    return res.status(500).json({ error:err, message:'server error' });
  }
};

export default signUpController;
