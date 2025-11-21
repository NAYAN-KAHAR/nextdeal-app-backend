import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import OTP from '../../Models/otpModel.js';
import customersAuth from '../../Models/customerAuth.js';
import RestaurantOwnerLogic from './RestaurantOwnerLogic.js';

const GenerateOTP = (number) => {
    let values = '0987654321';
    let result = '';
    for(let i=0; i<number; i++){
        let index = Math.floor(Math.random() *10)
        result += values[index];
    }
    return result
}



const otpGenerate = async (req, res) => {
  try {
    const { mobile } = req.body;
    if(!mobile) return res.status(400).json({ error: 'Number is required'});

    const shopkeeperExist = await ShopkeeperAuth.findOne({ mobile });
    const customerExist = await customersAuth.findOne({ mobile });

    let user;
    let role;

    if (shopkeeperExist) {
      user = shopkeeperExist;
      role = "Shopkeeper";
    } else if (customerExist) {
      user = customerExist;
      role = "Customer";
    } else {
      return res.status(400).json({ error: 'Number does not exist' });
    }

    // Generate OTP
    const otpCode = GenerateOTP(4);

    const savedOTP = await OTP.create({ user: user._id, otp: otpCode,role });

    // TODO: send OTP via SMS provider (MSG91, Twilio, etc.)
    console.log(`OTP for ${role}:`, otpCode);

    return res.status(201).json({ message: `OTP sent successfully`,savedOTP, userId: user._id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || err, message: 'Server error' });
  }
};

export default otpGenerate;

