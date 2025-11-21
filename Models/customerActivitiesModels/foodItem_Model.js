import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({

    FoodSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodSubCategory",
      required: [true, "FoodSubCategory is required"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restuarantId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: [true, "restuarantId is required"],
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


