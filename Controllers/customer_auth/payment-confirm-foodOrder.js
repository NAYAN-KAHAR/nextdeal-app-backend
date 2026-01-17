import axios from "axios";
import OrderModel from "../../Models/restuarentActivitiesModels/orderPlaceModel.js";

const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "orderId is required" });

    // Find order in your database
    const order = await OrderModel.findOne({ "paymentInfo.transactionId": orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Call Cashfree API to check order status
    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
    };

    const cashfreeRes = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      { headers }
    );

    const cashfreeData = cashfreeRes.data;

    // Update order in your database based on Cashfree status
    if (cashfreeData?.order_status === "PAID") {
        order.paymentInfo.status = "Paid"; // ✅ matches enum
        await order.save();
        return res.status(200).json({ status: "SUCCESS", message: "Payment successful" });
    } else {
        order.paymentInfo.status = "Failed"; // ✅ matches enum
        await order.save();
        return res.status(200).json({ status: "FAILED", message: "Payment not completed" });
    }


  } catch (err) {
    console.error("Confirm payment error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Payment confirmation failed", details: err.response?.data || err.message });
  }
};

export default confirmPayment;
