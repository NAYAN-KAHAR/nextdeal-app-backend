
import mongoose from "mongoose";

const customersModel = new mongoose.Schema({
  
  business_name: {type: String,required: true},
  mobile: { type: String,required: true,unique: true},
  address: {type: String,required: true},
  business_category: { type: String,required: true,},

  shopImg:String,
  email:{ type: String, unique:true },
  city:String,
  min_offer:String,
  max_offer:String,

}, { timestamps: true });

const ShopkeeperAuth = mongoose.model('Shopkeepers', customersModel);
export default ShopkeeperAuth;
