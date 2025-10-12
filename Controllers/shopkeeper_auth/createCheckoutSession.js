import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = plan === 'monthly' ? 49900 : 499900;

    const params = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: `${plan} Subscription` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://nextdeal-app-shopkeerper-frontend.vercel.app/Success?plan=${plan}`,
      cancel_url: `https://nextdeal-app-shopkeerper-frontend.vercel.app/Subcription`,

      // success_url: `http://localhost:3000/Success?plan=${plan}`,
      // cancel_url: `http://localhost:3000/Subcription`,
    };

    console.log("Creating Stripe session with params:", params);

    const session = await stripe.checkout.sessions.create(params);

    console.log("Stripe session created:", session);

    if (!session.url) {
      console.error("No session.url in response:", session);
      return res.status(500).json({ error: "Stripe session creation failed (no url returned)" });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });
    
  } catch (err) {
    console.error("Err message:", err.message);
    return res.status(500).json({error: "Stripe session creation failed",details: err.message });
  }
};

export default createCheckoutSession;
