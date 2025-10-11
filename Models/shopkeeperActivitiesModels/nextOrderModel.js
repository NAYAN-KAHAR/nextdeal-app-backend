import mongoose from "mongoose";

const nextOfferSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shopkeepers",
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecurringCoupon", 
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
  isUsed: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const NextOffersModel = mongoose.model("NextOffers", nextOfferSchema);
export default NextOffersModel;
