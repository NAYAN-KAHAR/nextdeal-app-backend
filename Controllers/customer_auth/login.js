
import customersAuth from '../../Models/customerAuth.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(); 
import OTP from '../../Models/otpModel.js';
import sendSMSOTP from '../../config/twillioOTP.js';
import axios from 'axios';


const customerSchema = Joi.object({
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
           .messages({message:'Mobile number must be exactly 10 digits'}),
      password: Joi.string().min(6).required(),
});


const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();




const loginController = async (req, res) => {
  try {
    const { mobile, password } = await customerSchema.validateAsync(req.body);

    const userExist = await customersAuth.findOne({ mobile }).lean();
    if (!userExist) {
      return res.status(400).json({ error: "User does not exists" });
    }

  
    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
       return res.status(401).json({ error: "Invalid password" });
    }

    const otp = generateOTP();

    // Send OTP
    // const sent = await sendSMSOTP(mobile, otp);
    // if (!sent) {
    //   return res.status(500).json({ error: "Failed to send OTP" });
    // }

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
    await OTP.create({ user: userExist._id, otp, role: "CustomerModel"});
    return res.status(200).json({ message: "OTP sent successfully", otpSent:true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default loginController;






// const loginController = async (req, res) => {
//     try {
     
//       const {mobile, password } = await customerSchema.validateAsync(req.body);
//       console.log(mobile, password);

//       const userExist = await customersAuth.findOne({ mobile:mobile }).lean();
//       if (!userExist) {
//         return res.status(400).json({ error: 'User deos not exists' });
//       }

//       const checkPassword = await bcrypt.compare(password, userExist.password); 
//       if(!checkPassword){ 
//           return res.status(401).json({ error: 'Invalid password' });
//       }
      
//       const customerToken = jwt.sign({mobile:userExist.mobile},
//                                `${process.env.CUSTOMER_SECRET}`, {expiresIn:'30d'});

//       res.cookie('customerToken', customerToken, {
//           httpOnly: true,       // prevent cross site scripting attack
//           secure: true,
//           sameSite: 'none',     // allow cross-site cookie
//           maxAge: 30 * 24 * 60 * 60 * 1000, 
//           });
        
//         // Generate OTP
//       const otp = generateOTP(4);

//       const sent = await sendSMSOTP(9907918907, otp);
//       if (!sent) {
//         return res.status(500).json({ error: "Failed to send OTP" });
//       }


//         // 5️⃣ Save OTP in DB (auto expires)
//       await OTP.create({
//         user: userExist._id,
//         otp,
//         role: "Customer"
//       });

//       // 6️⃣ Success Response
//        res.status(200).json({message: "OTP sent successfully",otpSent: true});
//       // console.log('customerToken : ', customerToken);
//       return res.status(200).json({ message: 'Login successful', user: userExist });

//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Server error' });
//     }
//   };

// export default loginController;

