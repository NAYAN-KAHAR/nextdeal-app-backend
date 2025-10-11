
import mongoose from "mongoose";

const freeCouponSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shopkeepers",
    required: true,
  },
  couponName: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed","bogo"],
    required: true,
  },
  spendingAmount: {
    type: String,
    required: true,
  },
  freeCoupon: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const FreeCoupon = mongoose.model("FreeCoupon", freeCouponSchema);

export default FreeCoupon;
