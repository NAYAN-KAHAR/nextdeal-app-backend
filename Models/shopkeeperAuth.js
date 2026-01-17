
import mongoose from "mongoose";

const ShopkeepersModel = new mongoose.Schema({
  
  business_name: {type: String,required: true},
  mobile: { type: String,required: true,unique: true, index:true},
  address: {type: String,required: true},
  business_category: { type: String,required: true,},

  shopImg:String,
  email: { type: String, unique: true, sparse: true },
  city:String,
  min_offer:String,
  max_offer:String,

}, { timestamps: true });


// ⭐ EXTRA INDEXES TO BOOST PERFORMANCE
ShopkeepersModel.index({ business_category: 1 });
ShopkeepersModel.index({ city: 1, address: 1 }); // compound
ShopkeepersModel.index({ city: 1, address: 1, business_category: 1 }); // mega-fast search



const ShopkeeperAuth = mongoose.model('Shopkeepers', ShopkeepersModel);
export default ShopkeeperAuth;
