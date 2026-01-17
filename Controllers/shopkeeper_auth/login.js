
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(); 
import OTP from '../../Models/otpModel.js';
import sendSMSOTP from '../../config/twillioOTP.js';


const shopkeeperSchema = Joi.object({
      business_name: Joi.string().trim().min(2).required(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
      .messages({
        "string.pattern.base": "Mobile number must be exactly 10 digits",
        "string.empty": "Mobile number is required",
      }),   
});


const generateOTP = (length = 4) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};



const loginController = async (req, res) => {
  try {
      const { mobile, business_name } = await shopkeeperSchema.validateAsync(req.body);

      const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();
      const restaurant = shopkeeper ? null : await RestaurantOwnerModel.findOne({ mobile }).lean();

      const user = shopkeeper || restaurant;

      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // Validate business name 
      if (user.business_name !== business_name.toLowerCase()) {
        return res.status(401).json({ error: "Wrong shop name" });
      }

   
      const otp = generateOTP(4);

      // const sent = await sendSMSOTP(mobile, otp);
      // if (!sent) {
      //   return res.status(500).json({ error: "Failed to send OTP" });
      // }

      if (!otp) {
        return res.status(500).json({ error: "Failed to send OTP" });
      }

      // Save OTP in DB (expires automatically)
      await OTP.create({ user: user._id, otp, 
        role: shopkeeper ? "ShopkeeperAuth" : "RestaurantOwnerModel"
      });
      return res.status(200).json({ message: "OTP sent successfully", otpSent:true });

  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.message });
    }
    console.error("login", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default loginController;
