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
    enum: ['CustomerModel', 'ShopkeeperAuth', 'RestaurantOwnerModel']
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // auto-delete after 5 minutes
  }
});

// Optional index for faster lookup
otpSchema.index({ user: 1, role: 1 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
