
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopkeepers',
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  remainingCoupons: {
    type: Number,
    default: 0,
  },
  cashfreePaymentId: { // store Cashfree payment/order ID
    type: String,
    required: false,
  },
  trial: {
    type: Boolean,
    default: true, // new users start with trial
  },
  wasTrialUsed: {
    type: Boolean,
    default: false,
  },
  initialTrialPlan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: false,
  },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
