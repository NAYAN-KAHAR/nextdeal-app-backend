
import mongoose from "mongoose";

const customersModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImg:String,
  address:String,
  email: { type: String, unique: true, sparse: true },
}, { timestamps: true });

const customersAuth = mongoose.model('Customers', customersModel);
export default customersAuth;
