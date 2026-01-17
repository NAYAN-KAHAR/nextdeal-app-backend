
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import RestaurantOwnerModel from '../../Models/restuarentsModel.js';
import OTP from '../../Models/otpModel.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config(); 


const verifyShopkeeperOTP = async (req, res) => {
  try {
      
      const { otp, mobile } = req.body;
      if (!mobile || !otp) {
        return res.status(400).json({ error: "Mobile and OTP are required" });
      }

     const shopkeeper = await ShopkeeperAuth.findOne({ mobile }).lean();
      const restaurant = shopkeeper ? null : await RestaurantOwnerModel.findOne({ mobile }).lean();

      const user = shopkeeper || restaurant;

      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // Find OTP record
      const otpData = await OTP.findOne({user: user._id,
         role: shopkeeper ? "ShopkeeperAuth" : "RestaurantOwnerModel", otp: otp});
      if (!otpData) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
      }

      // OTP is correct → delete it (security)
      await OTP.deleteOne({ _id: otpData._id });

      const shopkeeperToken = jwt.sign({mobile:user.mobile}, 
                                      `${process.env.SHOPKEEPER_SECRET}`,
                                       {expiresIn:'7d'});

      // Set Cookie
      res.cookie("shopkeeperToken", shopkeeperToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      console.log('shopkeeperToken', shopkeeperToken);

      return res.status(200).json({message: "OTP verified successfully",
        business_name: user.business_name,
        ID: restaurant ? restaurant._id : null,
        userType: restaurant ? "restaurantOwner" : "shopkeeper",
        login:true,
        user
      });
      
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default verifyShopkeeperOTP;
