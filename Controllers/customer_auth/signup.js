
import customersAuth from '../../Models/customerAuth.js';
import bcrypt from 'bcrypt';
import Joi  from 'joi';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';


const customerSchema = Joi.object({
      name: Joi.string().trim().min(2).required(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
      .messages({message:'Mobile number must be exactly 10 digits'}),
      password: Joi.string().min(6).required(),
});


const signUpController = async (req, res) => {
  try {
   
    const { name, mobile, password } = await customerSchema.validateAsync(req.body);

    const userExist = await customersAuth.findOne({ mobile });
    if (userExist) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const shopkeeperExist = await ShopkeeperAuth.findOne({ mobile });
    if (shopkeeperExist) {
      return res.status(400).json({ error: 'Number already exists' });
    }


    const hashPassword = bcrypt.hashSync(password, 10);
    
    const userData = {
      name: req.body.name.toLowerCase(),
      mobile,
      password: hashPassword,
    };

    const user = await customersAuth.create(userData);
    return res.status(201).json({ message: 'User created successfully', user });

  } catch (err) {
    // console.error(err);
    return res.status(403).json({ error:err });
  }
};

export default signUpController;
