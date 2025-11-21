import dotenv from 'dotenv';
import Subscription from '../../Models/subscriptionModel.js';
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
dotenv.config();

const SubscribePlan = async (req, res) => {
  try {
    const { plan, cashfreePaymentId } = req.body;
    const mobile = req.user?.mobile;

    if (!mobile) return res.status(401).json({ error: "Unauthorized user" });

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) return res.status(404).json({ error: "Shopkeeper not found" });

    let subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });
    const now = new Date();

    if (!subscription) {
      // 🆕 New user - start 1 month free trial
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      subscription = new Subscription({
        shopkeeper: shopkeeper._id,
        plan,
        price: 0,
        startedAt: now,
        expiresAt,
        remainingCoupons: plan === 'yearly' ? 15 : 0,
        trial: true,
        wasTrialUsed: false,
        initialTrialPlan: plan,
      });

      await subscription.save();
      return res.status(200).json({
        message: `🎉 You are on a 1-month free trial (${plan} plan).`,
        subscription,
      });
    }

    // ⚙️ Existing user - check if trial expired or active
    const trialExpired = subscription.trial && subscription.expiresAt <= now;
    const canResubscribe = !subscription.trial && subscription.expiresAt <= now;

    if (trialExpired || canResubscribe) {
      // ✅ Paid subscription renewal
      const expiresAt = new Date(now);
      if (plan === 'yearly') expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setMonth(expiresAt.getMonth() + 1);

      subscription.plan = plan;
      subscription.price = plan === 'yearly' ? 4999 : 499; // match Cashfree
      subscription.startedAt = now;
      subscription.expiresAt = expiresAt;
      subscription.trial = false;
      subscription.wasTrialUsed = true;
      subscription.cashfreePaymentId = cashfreePaymentId;
      subscription.remainingCoupons = plan === 'yearly' ? 15 : 0;

      await subscription.save();
      return res.status(200).json({
        message: `✅ You are now subscribed to the ${plan} plan.`,
        subscription,
      });
    }

    return res.status(400).json({
      error: "Your trial or current plan is still active. Please wait until it expires.",
      expiresAt: subscription.expiresAt,
    });

  } catch (err) {
    console.error("SubscribePlan Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

export default SubscribePlan;





/*
const SubscribePlan = async (req, res) => {
  try {
    const { plan, cashfreePaymentId } = req.body;
    const mobile = req.user?.mobile;

    if (!mobile) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });
    if (!shopkeeper) {
      return res.status(404).json({ error: "Shopkeeper not found" });
    }

    let subscription = await Subscription.findOne({ shopkeeper: shopkeeper._id });
    const now = new Date();

    if (!subscription) {
      // New user - give 1 month free trial
      subscription = new Subscription({
        shopkeeper: shopkeeper._id,
        plan,
        price: 0, // free trial
        startedAt: now,
        expiresAt: new Date(now.setMonth(now.getMonth() + 1)), // 1 month trial
        remainingCoupons: plan === 'yearly' ? 15 : 0,
        trial: true,
        wasTrialUsed: false,
        initialTrialPlan: plan,
      });
    } else {
      // Existing user subscribing after trial
      const trialExpired = subscription.trial && subscription.expiresAt <= now;

      if (trialExpired) {
        subscription.plan = plan;
        subscription.price = plan === 'yearly' ? 12000 : 1200; // example pricing
        subscription.startedAt = now;
        subscription.expiresAt = plan === 'yearly' 
          ? new Date(now.setFullYear(now.getFullYear() + 1)) 
          : new Date(now.setMonth(now.getMonth() + 1));

        subscription.remainingCoupons = plan === 'yearly' ? 15 : 0;
        subscription.cashfreePaymentId = cashfreePaymentId;
        subscription.trial = false;
        subscription.wasTrialUsed = true;
      } else {
        return res.status(400).json({ error: "Trial still active." });
      }
    }

    await subscription.save();
    return res.status(200).json({
      message: subscription.trial 
        ? `You are on a 1-month free trial (${plan} plan).` 
        : `You are now subscribed to ${plan} plan.`,
      subscription,
    });

  } catch (err) {
    console.error("SubscribePlan Error:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

export default SubscribePlan;


*/