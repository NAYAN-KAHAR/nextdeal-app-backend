import mongoose from "mongoose";

const SaleCouponsSchema = new mongoose.Schema({
   purchase_amount: {
    type: Number,
    required: true,
  },
   customerType: {
    type: String,
    enum: ["new", "recurring"],
    required: true,
  },

  shopkeeper_mobile: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
  },
  coupon_id: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed", "bogo"],
    required: true,
  }, 
  subtotal: {
    type: Number,
    required: true,
  },
  

}, { timestamps: true });

const SaleCouponsModel = mongoose.model("SaleCoupons", SaleCouponsSchema);
export default SaleCouponsModel;
