import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'role' // dynamic reference
  },
  otp: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['Customer', 'Shopkeeper'] // exact model names
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 120 // auto-delete after 5 minutes
  }
});

// Optional index for faster lookup
otpSchema.index({ user: 1, role: 1 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;

/*
import OTP from './models/OTP.js';
const otpRecord = await OTP.findOne({ otp: '123456' }).populate('user');
console.log(otpRecord.user); // full Shopkeeper or Customer document
*/