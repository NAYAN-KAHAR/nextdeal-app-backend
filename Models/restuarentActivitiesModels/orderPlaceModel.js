import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Items in this order
    items: [
      {
        foodItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodSubCategory", // menu item
          required: true,
        },
        name: String, // snapshot of item name at time of order
        price: Number, // snapshot of price (with discount applied)
        quantity: {
          type: Number,
          default: 1,
        },
        image: String,
        discount: {
          type: Number,
          default: 0,
        },
        totalItemPrice: Number, // computed: (price * quantity)
      },
    ],

    // Address snapshot (not ref, because customer might delete/update)
    deliveryAddress: {
      name:String,
      label: String,
      street: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Payment details
    paymentInfo: {
      method: {
        type: String,
        enum: ["COD", "UPI", "Card", "Wallet"],
        default: "COD",
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      transactionId: String,
      amountPaid: Number,
    },

    // Delivery information
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
    deliveryStatus: {
      type: String,
      enum: [
        "Order Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order Placed",
    },

    // Pricing Summary
    pricing: {
      subTotal: Number, // before taxes
      deliveryFee: Number,
      discount: Number,
      total: Number, // final payable
    },

    // Timestamps for tracking
    orderedAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: Date,
    cancelledAt: Date,

    // Status flags
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// At the bottom of your orderSchema file
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ orderedAt: -1 });
orderSchema.index({ deliveryPartner: 1 });


const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;




/*
{
  "_id": "6731b2f7...",
  "customerId": "66ff9ab1...",
  "restaurantId": "66ffc4a2...",
  "items": [
    {
      "foodItemId": "66ffda22...",
      "name": "Paneer Butter Masala",
      "price": 220,
      "quantity": 2,
      "discount": 10,
      "totalItemPrice": 396
    },
    {
      "foodItemId": "66ffda29...",
      "name": "Garlic Naan",
      "price": 40,
      "quantity": 4,
      "totalItemPrice": 160
    }
  ],
  "deliveryAddress": {
    "label": "Home",
    "street": "MG Road",
    "city": "Bangalore",
    "pincode": "560001"
  },
  "paymentInfo": {
    "method": "UPI",
    "status": "Paid",
    "transactionId": "txn_93jsk20",
    "amountPaid": 556
  },
  "deliveryStatus": "Out for Delivery",
  "pricing": {
    "subTotal": 556,
    "tax": 28,
    "deliveryFee": 25,
    "discount": 50,
    "total": 559
  },
  "orderedAt": "2025-11-07T14:10:00Z"
}


import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true, // Ensure each delivery partner has a unique phone number
    },
    vehicleType: {
      type: String,
      enum: ["Bike", "Car", "Truck"], // Type of vehicle used for delivery
      required: true,
    },
    currentLocation: {
      lat: { type: Number },  // Latitude for current location of the delivery partner
      lng: { type: Number },  // Longitude for current location of the delivery partner
    },
    status: {
      type: String,
      enum: ["Available", "On Delivery", "Busy", "Offline"],
      default: "Available", // Default status of a delivery partner
    },
    rating: {
      type: Number, // Average rating from customers
      min: 0,
      max: 5,
      default: 5,
    },
    assignedOrders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Keep track of orders assigned to this partner
    }],
    lastActive: {
      type: Date,
      default: Date.now, // Timestamp to track last time the partner was active
    },
  },
  { timestamps: true }
);

const DeliveryPartnerModel = mongoose.model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartnerModel;

*/
