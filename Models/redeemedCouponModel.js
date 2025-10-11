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

const redeemedCouponModel=mongoose.model('RedeemedCoupon', redeemedCouponSchema);
export default redeemedCouponModel;
