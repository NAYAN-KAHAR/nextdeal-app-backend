
import customersAuth from '../../Models/customerAuth.js';
import dotenv from 'dotenv';
dotenv.config();
import OTP from '../../Models/otpModel.js';
import axios from 'axios';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();



const customerMobileOTP = async (req, res) => {
  try {
    const { mobile } = req.body;
    console.log(mobile);

    const userExist = await customersAuth.findOne({ mobile }).lean();
    if (!userExist) {
      return res.status(400).json({ error: "User does not exists" });
    }

    const otp = generateOTP();

    // Send OTP
    const sent = await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      {
        integrated_number: "15557709121",
        content_type: "template",
        payload: {
          messaging_product: "whatsapp",
          type: "template",
          template: {
            name: "nxt_deal_otp",
            language: { code: "en" },
            to_and_components: [
              {
                to: [`91${mobile}`],
                components: {
                  body_1: {
                    type: "text",
                    value: otp
                  },
                  button_1: {
                    type: "text",
                    subtype: "url",
                    value: "CLICK_HERE" // Short dummy text <=15 chars
                  }
                }
              }
            ]
          }
        }
      },
      {
        headers: {
          authkey: "481837Apv7wbv3r8W69367123P1",
          "Content-Type": "application/json"
        }
      }
    );
    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }
    // Save OTP in DB (expires automatically)
    await OTP.create({ user: userExist._id, otp, role: "CustomerModel" });
    return res.status(200).json({ message: "OTP sent successfully", otpSent: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default customerMobileOTP;