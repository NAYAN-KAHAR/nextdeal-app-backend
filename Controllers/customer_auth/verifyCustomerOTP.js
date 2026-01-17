
import customersAuth from '../../Models/customerAuth.js';
import OTP from '../../Models/otpModel.js';
import jwt from "jsonwebtoken";


const verifyCustomerOTP = async (req, res) => {
  try {
      
      const { otp, mobile } = req.body;

      if (!mobile || !otp) {
        return res.status(400).json({ error: "Mobile and OTP are required" });
      }

      const user = await customersAuth.findOne({ mobile }).lean();
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      // Find OTP record
      const otpData = await OTP.findOne({user: user._id,role: "CustomerModel", otp: otp});
      if (!otpData) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
      }

      // OTP is correct → delete it (security)
      await OTP.deleteOne({ _id: otpData._id });

      const customerToken = jwt.sign({ mobile: user.mobile },`${process.env.CUSTOMER_SECRET}`,{ expiresIn: "7d" });

      // Set Cookie
      res.cookie("customerToken", customerToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      console.log('customerToken', customerToken);
      return res.status(200).json({ message: "OTP verified successfully",login: true,user});
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default verifyCustomerOTP;
