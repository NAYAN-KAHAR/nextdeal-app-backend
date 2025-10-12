import mongoose from 'mongoose';

const redeemedCouponSchema = new mongoose.Schema({
  couponName:{
    type:String,
    required:true
  },
  customer_mobile: {
    type: String,
    required: true
  },
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  shopkeeper_mobile: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'amount'],
    required: true
  },
  spendingAmount: {
    type: String,
    required: true
  },
  redeemedAt: {
    type: Date,
    default: Date.now
  },
  delivered: {
  type: Boolean,
  default: false
}
});
// ✅ Unique index to prevent duplicate redemption
redeemedCouponSchema.index(
  { shopkeeper_mobile: 1, customer_mobile: 1, coupon_id: 1 },
  { unique: true }
);

const redeemedCouponModel=mongoose.model('RedeemedCoupon', redeemedCouponSchema);
export default redeemedCouponModel;
