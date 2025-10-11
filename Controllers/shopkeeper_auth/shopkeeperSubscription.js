
import Subscription from "../../Models/subscriptionModel.js";
import ShopkeeperAuth from "../../Models/shopkeeperAuth.js";

import dotenv from 'dotenv';
dotenv.config(); 


const SubscribePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const mobile = req.user?.mobile;
    console.log('mobile', plan, mobile);

    if (!mobile) return res.status(401).json({ error: "Unauthorized user" });

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) return res.status(404).json({ error: "Shopkeeper not found" });


    const existing = await Subscription.findOne({ shopkeeper: shopkeeper._id });
     if (existing) {
      return res.status(400).json({ error: "Subscription already exists for this shopkeeper" });
    }


    const price = plan === 'monthly' ? 499 : 4999;
    const expiresAt = plan === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const newSubscription = await Subscription.create({shopkeeper: shopkeeper._id, 
         plan,price,
         expiresAt, 
         remainingCoupons: plan === 'yearly' ? 15 : 0,
        stripeSessionId: req.body.sessionId
        });

    res.status(200).json({ message:`subscribed successfully to ${plan} plan.`,
      subscription: newSubscription});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default SubscribePlan ;
