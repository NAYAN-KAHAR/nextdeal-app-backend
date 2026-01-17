
import axios from "axios";
import ShopkeeperAuth from "../../Models/shopkeeperAuth.js";

const createCashfreeOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const shopkeeper = await ShopkeeperAuth.findOne({ mobile: req.user.mobile }).lean();

    if (!shopkeeper) {
      return res.status(404).json({ error: "Shopkeeper not found" });
    }

    const shopkeeperId = shopkeeper._id;
    const amount = plan === "monthly" ? 499 : 4999; // INR
    const orderId = `order_${Date.now()}`;

    const url = "https://sandbox.cashfree.com/pg/orders"; // sandbox endpoint

    const data = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      order_note: `${plan} plan payment`,
      customer_details: {
        customer_id: shopkeeperId.toString(),
        customer_phone: req.user.mobile,
        customer_email: req.user.email || "test@example.com",
      },
      order_meta: {
        return_url: `http://localhost:3000/Success?plan=${plan}&order_id=${orderId}`,
        notify_url: `http://localhost:5000/api/payment-webhook`,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01", // required for latest API
    };

    const response = await axios.post(url, data, { headers });
    const cashfreeData = response.data;

    // ✅ Cashfree v2022-09-01 doesn't return "status", so just check if session exists
    if (!cashfreeData?.payment_session_id) {
      console.error("Cashfree response missing payment_session_id:", cashfreeData);
      return res.status(500).json({
        error: "Failed to create Cashfree payment session",
        details: cashfreeData,
      });
    }

    return res.status(200).json({
      orderId: cashfreeData.order_id,
      paymentSessionId: cashfreeData.payment_session_id,
    });
  } catch (err) {
    console.error("Cashfree create order error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Cashfree order creation failed",
      details: err.response?.data || err.message,
    });
  }
};

export default createCashfreeOrder;




// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createCheckoutSession = async (req, res) => {
//   try {
//     const { plan } = req.body;
//     console.log('checkout', plan);
    
//     // Define your price IDs for the plans
//     // const priceId = plan === 'monthly'
//     //   ? process.env.STRIPE_PRICE_ID_MONTHLY
//     //   : process.env.STRIPE_PRICE_ID_YEARLY;

//     const priceId = plan === 'monthly'
//        ? 'price_1SKIqqBM9DJQEOgaaNUeZb45'
//        : 'price_1SKIrKBM9DJQEOgab8vvOfcy';
//     if (!priceId) {
//       return res.status(400).json({ error: "Invalid plan or price ID not set" });
//     }

//     const session = await stripe.checkout.sessions.create({
//           mode: 'subscription',
//           payment_method_types: ['card'],
//           line_items: [{ price: priceId, quantity: 1 }],
//           subscription_data: {
//             trial_period_days: 30,
//           },
//           success_url: `http://localhost:3000/Success?session_id={CHECKOUT_SESSION_ID}`,
//           cancel_url: `http://localhost:3000/Subcription`,
//     });


//     return res.status(200).json({ url: session.url, sessionId: session.id });

//   } catch (err) {
//     console.error("Stripe session creation failed:", err);
//     return res.status(500).json({ error: "Stripe session creation failed", details: err.message });
//   }
// };

// export default createCheckoutSession;
