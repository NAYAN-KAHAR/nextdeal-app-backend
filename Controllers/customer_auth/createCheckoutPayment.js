
import axios from "axios";
import customersAuth from "../../Models/customerAuth.js";
import OrderModel from '../../Models/restuarentActivitiesModels/orderPlaceModel.js';


const createCashfreePaymentForOrder = async (req, res) => {
  try {
    const { totalPrice, orderId } = req.body; // orderId = DB order _id

    if (!totalPrice || !orderId) {
      return res.status(400).json({ error: "Total price and orderId are required" });
    }

    // Find customer
    const customer = await customersAuth.findOne({ mobile: req.user.mobile }).lean();
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Generate unique orderCode for Cashfree
    const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Update existing order with totalPrice and orderCode
    const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        {
            "pricing.total": totalPrice,
            "paymentInfo.status": "Pending",
            "paymentInfo.transactionId": orderCode,
        },
        { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Prepare Cashfree API request
    const cashfreeData = {
      order_id: orderCode,
      order_amount: totalPrice,
      order_currency: "INR",
      order_note: `Food order payment of ₹${totalPrice}`,
      customer_details: {
        customer_id: customer._id.toString(),
        customer_phone: customer.mobile,
        customer_email: customer.email || "test@example.com",
      },
      order_meta: {
        return_url: `http://localhost:3000/customerSuccess?order_id=${orderCode}`,
        notify_url: `http://localhost:5000/api/payment-webhook`,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
    };

    const response = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",
        cashfreeData,
        { headers }
        );

    const cashfreeDataResponse = response.data;


    if (!cashfreeDataResponse?.payment_session_id) {
      return res.status(500).json({ error: "Failed to create Cashfree payment session", details: cashfreeDataResponse });
    }

    return res.status(200).json({
      dbOrderId: updatedOrder._id,
      orderId: cashfreeDataResponse.order_id,
      paymentSessionId: cashfreeDataResponse.payment_session_id,
    });

  } catch (err) {
    console.error("Cashfree create order error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Cashfree order creation failed", details: err.response?.data || err.message });
  }
};

export default createCashfreePaymentForOrder;
