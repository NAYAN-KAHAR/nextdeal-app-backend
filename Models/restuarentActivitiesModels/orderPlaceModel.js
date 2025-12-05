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
      ref: "RestaurantsOwner",
      required: true,
    },

    // Items in this order
  items: [
      {
        foodItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodSubCategory",
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
        totalItemPrice: Number,

    // Optional add-ons for this food item
    addOns: [
          {
            addOnItem: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AddOnModels",
              required: true,
            },
            name: String, // snapshot of add-on name
            price: Number, // snapshot of add-on price
            quantity: {
              type: Number,
              default: 1,
            },
            image: String,
            discount: {
              type: Number,
              default: 0,
            },
            totalItemPrice: Number, // computed: price * quantity
          },
        ],
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
    deliveryType: {
      type: String,
      enum: ["Self Pickup", "Delivery Partner"],
      default: "Delivery Partner",
    },
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

    // Extra order instructions & tip
    instructions: {
      type: [String], // can store multiple instructions
      default: [],
    },
    tip: {
      type: Number,
      default: 0,
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

    orderCode: {
      type: String,
      unique: true,
      required: true,
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



