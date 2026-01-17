import dotenv from 'dotenv';
dotenv.config(); 
import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const client = twilio(accountSid, authToken);

// code from twillio
const sendSMSOTP = async (mobile, otp) => {
    try {
      const message = await client.messages.create({
        body: `${otp} is your NextDeal login OTP, valid for 5 minutes. 
        Keep this verification code confidential and do not share it with anyone.`,
        from: "+12185206584", // your Twilio number
        to: `+91${mobile}`
      });

      // console.log("OTP Sent SID:", message.sid);
      return true;
    } catch (error) {
      console.log("Twilio Error:", error.message);
      return false;
    }
  };

  export default sendSMSOTP;