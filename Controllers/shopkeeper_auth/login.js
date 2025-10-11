
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(); 



const shopkeeperSchema = Joi.object({
      business_name: Joi.string().trim().min(2).required(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
           .messages({message:'Mobile number must be exactly 10 digits'}),
      
});


const loginController = async (req, res) => {
    try {
     
      const {mobile, business_name } = await shopkeeperSchema.validateAsync(req.body);
      console.log(mobile, business_name);

      const shopkeeperExist = await ShopkeeperAuth.findOne({ mobile:mobile });
      if (!shopkeeperExist) {
        return res.status(400).json({ error: 'User deos not exists' });
      }

      if(shopkeeperExist.business_name !== business_name.toLowerCase()){ 
          return res.status(401).json({ error: 'Wrong shopname' });
      }
      
      const shopkeeperToken = jwt.sign({mobile:shopkeeperExist.mobile}, 
                                       `${process.env.SHOPKEEPER_SECRET}`, {expiresIn:'7d'});

      res.cookie('shopkeeperToken', shopkeeperToken, {
          httpOnly: true,       // prevent cross site scripting attack
          secure: true,
          sameSite: 'none',     // allow cross-site cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, 
          });

      console.log('shopkeeperToken : ', shopkeeperToken);
      return res.status(200).json({ message: 'Login successful', business_name:shopkeeperExist.business_name });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

export default loginController;
