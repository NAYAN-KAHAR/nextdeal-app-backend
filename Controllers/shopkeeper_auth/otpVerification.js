
import OTP from '../../Models/otpModel.js';

const otpVerification = async (req, res) => {
  try {
    const { sendedOTP } = req.body;

    if(!sendedOTP) return res.status(400).json({ error: 'OTP is required'});

    const verifiedOTP = await OTP.findOne({ otp: sendedOTP });

    if(!verifiedOTP) return res.status(400).json({ error: 'OTP does not exist'});
    
    return res.status(200).json({ message: `OTP Verified successfully`, verifiedOTP});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || err, message: 'Server error' });
  }
};

export default otpVerification;
