
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

    const shopkeeperExist = await ShopkeeperAuth.findOne({ mobile }).lean();
    if (shopkeeperExist) {
      return res.status(400).json({ error: "Number already registered as shopkeeper" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Let MongoDB handle duplicate customer mobile
    const user = await customersAuth.create({
      name: name.toLowerCase(),
      mobile,
      password: hashPassword,
    });

    return res.status(201).json({ message: 'User created successfully', user });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Mobile number already registered" });
    }

    if (err.isJoi) {
      return res.status(400).json({ error: err.details[0].message });
    }

    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default signUpController;