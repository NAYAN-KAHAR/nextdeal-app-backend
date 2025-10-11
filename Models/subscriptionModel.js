// models/Subscription.js

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
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
