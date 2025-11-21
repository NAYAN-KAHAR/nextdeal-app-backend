import mongoose from "mongoose";

const customersModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  profileImg: String,
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  address: String, // Main address text
  location: {
    type: {
      type: String,       // 'Point'
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],     // [longitude, latitude]
      required: true
    }
  }
}, { timestamps: true });

// Create geospatial index for location
customersModel.index({ location: "2dsphere" });

const customersAuth = mongoose.model('Customers', customersModel);
export default customersAuth;
