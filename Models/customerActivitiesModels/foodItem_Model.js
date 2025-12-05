import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    // Either FoodSubCategory OR AddOn
    FoodSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodSubCategory",
      required: false,   // changed
    },

    addOnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddOnModels",
      required: false,   // added
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    restuarantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: true,
    },

    count: {
      type: Number,
      default: 1,
      min: [1, "Count must be at least 1"],
    },
  },
  { timestamps: true }
);

const FoodItemsModel = mongoose.model("FoodCards", foodItemSchema);
export default FoodItemsModel;
