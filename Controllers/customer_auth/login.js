
import customersAuth from '../../Models/customerAuth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(); 


const customerSchema = Joi.object({
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
           .messages({message:'Mobile number must be exactly 10 digits'}),
      password: Joi.string().min(6).required(),
});


const loginController = async (req, res) => {
    try {
     
      const {mobile, password } = await customerSchema.validateAsync(req.body);
      console.log(mobile, password);

      const userExist = await customersAuth.findOne({ mobile:mobile });
      if (!userExist) {
        return res.status(400).json({ error: 'User deos not exists' });
      }

      const checkPassword = bcrypt.compareSync(password, userExist.password); 
      if(!checkPassword){ 
          return res.status(401).json({ error: 'Invalid password' });
      }
      
      const customerToken = jwt.sign({mobile:userExist.mobile},
                               `${process.env.CUSTOMER_SECRET}`, {expiresIn:'7d'});

      res.cookie('customerToken', customerToken, {
          httpOnly: true,       // prevent cross site scripting attack
          secure: true,
          sameSite: 'none',     // allow cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, 
          });

      console.log('customerToken : ', customerToken);
      return res.status(200).json({ message: 'Login successful', user: userExist });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

export default loginController;